package com.tiajulia.backend.checkout;

// Imports necesarios
import com.tiajulia.backend.producto.model.Producto;
import com.tiajulia.backend.producto.repository.ProductoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController // Indica que esta clase maneja peticiones web y devuelve datos (JSON), no
                // vistas HTML.
@RequestMapping("/api/checkout") // Define que todas las rutas de este archivo empiezan con esa URL base.
@CrossOrigin(origins = "http://localhost:5173") // Permite que este frontend pueda comunicarse con el backend sin ser
                                                // bloqueado por seguridad del navegador.
public class CheckoutController {
    // Se usa para registrar errores en la consola (F12).
    private static final Logger log = LoggerFactory.getLogger(CheckoutController.class);
    // Inyecta la credencial de Mercado Pago desde application.properties.
    @Value("${mp.access-token}")
    private String accessToken;
    // Redirigen a las páginas de Mercado Pago después de pagar.
    @Value("${mp.success-url:http://localhost:5173/success}")
    private String successUrl;
    @Value("${mp.failure-url:http://localhost:5173/failure}")
    private String failureUrl;
    @Value("${mp.pending-url:http://localhost:5173/pending}")
    private String pendingUrl;
    @Value("${mp.notification-url:}")
    private String notificationUrl;
    // Conexión a la BD.
    private final ProductoRepository productoRepository;
    // Navegador interno de Java para comunicarse con Mercado Pago.
    private final RestTemplate rest = new RestTemplate();

    // Spring Boot usa este Constructor para inyectar automáticamente el repositorio
    // al iniciar la clase.
    public CheckoutController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // El método que se ejecuta cuando el usuario le da a pagar en el front.
    // Si la preferencia que se crea es nula, de igual manera los items que se
    // piden, están vacíos, nos arrojará un error que diga "Carrito vacío".
    @PostMapping("/preference")
    public ResponseEntity<Map<String, Object>> crearPreferencia(@RequestBody CreatePreferenceReq req) {
        if (req == null || req.getItems() == null || req.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Carrito vacío");
        }
        // Limpieza de URLs para evitar espacios en blanco.
        final String sSuccess = successUrl == null ? "" : successUrl.trim();
        final String sFailure = failureUrl == null ? "" : failureUrl.trim();
        final String sPending = pendingUrl == null ? "" : pendingUrl.trim();
        // Verifica si la URL de éxito es local (localhost o 127.0.0.1).
        final boolean successEsLocal = sSuccess.contains("localhost") || sSuccess.contains("127.0.0.1");
        // Se crea una lista que Mercado Pago va a leer, para posteriormente devolver
        // "pedido".
        List<Map<String, Object>> items = new ArrayList<>();
        Map<Integer, Integer> pedido = new LinkedHashMap<>();
        // Una iteración en donde si el ID es nulo, la cantidad también es nula o es
        // menor o igual a 0, nos arrojará un error que diga "Ítem Inválido".
        for (CartItem it : req.getItems()) {
            Integer id = it.getId();
            Integer qty = it.getQuantity();
            if (id == null || qty == null || qty <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item inválido");
            }
            // Busca el id del producto en la BD, por seguridad, para evitar que se pueda
            // cambiar el precio mediante el frontend, cambiando el precio.
            Producto p = productoRepository.findById(id)
                    .orElseThrow(
                            // Si no se encuentra el producto, nos arrojará un error.
                            () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto no existe: " + id));
            // Verifica que haya suficiente stock en la BD, de lo contrario, nos arrojará un
            // error.
            if (p.getStock() < qty) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock insuficiente para " + p.getNombre());
            }
            // Construye el objeto "mpItem" que mercado pago está esperando, y llena el mapa
            // "pedido" para saber qué se compró.
            Map<String, Object> mpItem = new HashMap<>();
            mpItem.put("title", p.getNombre()); // Define el título del producto.
            mpItem.put("quantity", qty); // Define la cantidad.
            mpItem.put("unit_price", p.getPrecio()); // Usa el precio real de la BD.
            mpItem.put("currency_id", "PEN"); // Define la moneda en soles.
            items.add(mpItem);

            pedido.put(p.getId(), qty); // Guarda ID y Cantidad para usarlo luego.
        }
        // Configuración de los Back Url's, en dónde van a redirigirse tras pagar.
        Map<String, Object> backUrls = new HashMap<>();
        if (!sSuccess.isEmpty())
            backUrls.put("success", sSuccess);
        if (!sFailure.isEmpty())
            backUrls.put("failure", sFailure);
        if (!sPending.isEmpty())
            backUrls.put("pending", sPending);
        // Se está armando el objeto JSON que se enviará.
        Map<String, Object> body = new HashMap<>();
        body.put("items", items);
        if (!backUrls.isEmpty()) {
            body.put("back_urls", backUrls);
        }
        // Regla de Mercado Pago, redirige automáticamente a la tienda después de pagar,
        // siempre y cuando no sea en localhost, sino en direcciones seguras como https
        // <--- Debido a entornos reales.
        if (!successEsLocal && !sSuccess.isEmpty()) {
            body.put("auto_return", "approved");
        } else {
            log.warn("auto_return omitido (success en localhost) para evitar 'invalid_auto_return' de MP");
        }
        // Cuando el estado del pago cambie a aprovado avise a esta dirección del
        // webhook (solo funcionará con la dirección https REAL del negocio).
        if (notificationUrl != null && !notificationUrl.isBlank()) {
            body.put("notification_url", notificationUrl.trim());
        }
        // Se adjunta la lista de ID's y Cantidades de "pedido", Mercado Pago guarda
        // esto y devuelve cuando confirme el pago, para saber qué productos se
        // descuentan del inventario.
        body.put("metadata", Map.of("pedido", pedido));
        body.put("external_reference", UUID.randomUUID().toString());
        log.info("MP back_urls: {}", backUrls);
        log.info("MP auto_return: {}", body.get("auto_return"));
        // Se coloca el token de acceso para decirle a Mercado Pago que yo soy quien
        // hace la petición y tengo permiso para cobrar.
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        // Realiza la petición de Mercado Pago enviando el token y los datos de la
        // compra.
        try {
            ResponseEntity<Map> mpResp = rest.postForEntity(
                    "https://api.mercadopago.com/checkout/preferences",
                    new HttpEntity<>(body, headers),
                    Map.class);
            // Mercado Pago crea un objeto donde se obtiene el ID y redirige al usuario.
            Map<?, ?> r = mpResp.getBody();
            Map<String, Object> out = new HashMap<>();
            out.put("preferenceId", r != null ? r.get("id") : null); // Obtiene el identificador de la preferencia.
            out.put("init_point", r != null ? r.get("init_point") : null); // Obtiene el init_point (enlace web de pago)
                                                                           // y devuelve al Frontend para redirigir al
                                                                           // usuario.
            return ResponseEntity.ok(out);
        } catch (HttpClientErrorException e) {
            // Propaga el detalle de MP como 400 en vez de 500
            log.error("Error MP {} -> {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getResponseBodyAsString());
        } catch (RestClientException e) {
            log.error("Error comunicando con MP", e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Error comunicando con Mercado Pago");
        }
    }

    // Recibe notificaciones, ya sea de información en la URL (param) o del body.
    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(@RequestParam Map<String, String> params,
            @RequestBody(required = false) Map<String, Object> body) {
        try {
            // Verifica que la notificación sea de tipo "payment".
            String type = params.getOrDefault("type", body != null ? String.valueOf(body.get("type")) : null);
            if (!"payment".equalsIgnoreCase(type))
                return ResponseEntity.ok().build();
            // Se extrae el ID del pago.
            String paymentId = params.get("data.id");
            if (paymentId == null && body != null) {
                Object data = body.get("data"); // Lógica para buscar el ID dentro del body del mensaje si no vino en la
                                                // URL.
                if (data instanceof Map<?, ?> m && m.get("id") != null) {
                    paymentId = String.valueOf(m.get("id"));
                }
            }
            if (paymentId == null)
                return ResponseEntity.ok().build();
            // Verificación REAL
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            // Consulta a Mercado Pago el estado real del pago usando el ID.
            ResponseEntity<Map> payResp = rest.exchange(
                    "https://api.mercadopago.com/v1/payments/" + paymentId,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class);

            Map<?, ?> payment = payResp.getBody();
            if (payment == null)
                return ResponseEntity.ok().build();
            // Si el pago no está aprobado, no hace nada
            String status = String.valueOf(payment.get("status"));
            if (!"approved".equalsIgnoreCase(status))
                return ResponseEntity.ok().build();
            // Se actualiza el stock, Mercado Pago nos devuelve los datos de "pedido", el
            // bucle recorre esos datos y le dice a la BD que reste esa cantidad del
            // inventario disponible.
            Object metaObj = payment.get("metadata");
            if (metaObj instanceof Map<?, ?> meta) {
                Object pedidoObj = meta.get("pedido");
                if (pedidoObj instanceof Map<?, ?> pedido) {
                    for (Map.Entry<?, ?> e : pedido.entrySet()) {
                        Integer pid = Integer.valueOf(String.valueOf(e.getKey()));
                        Integer qty = Integer.valueOf(String.valueOf(e.getValue()));
                        productoRepository.findById(pid).ifPresent(p -> {
                            p.setStock(p.getStock() - qty); // Restar el stock de la BD.
                            productoRepository.save(p);
                        });
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return ResponseEntity.ok().build();
    }

    // La clase CreatePreferenceReq sirve como contenedor y representa todo el
    // objeto JSON que llega del frontend.
    // Sin esta clase, Spring Boot no sabría que dentro del JSON hay una propiedad
    // llamada "items".
    public static class CreatePreferenceReq {
        // Espera recibir una lista de objetos y cada objeto tendrá la estructura
        // definida en la clase "CartItem".
        private List<CartItem> items;

        // Getters&Setters
        public List<CartItem> getItems() {
            return items;
        }

        public void setItems(List<CartItem> items) {
            this.items = items;
        }
    }

    // La clase CartItem define el detalle del producto que el usuario quiere
    // comprar
    public static class CartItem {
        private Integer id;
        private Integer quantity;

        // Getters&Setters
        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
