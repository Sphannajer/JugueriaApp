package com.tiajulia.backend.checkout;

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

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:5173")
public class CheckoutController {

    private static final Logger log = LoggerFactory.getLogger(CheckoutController.class);

    @Value("${mp.access-token}")
    private String accessToken;

    @Value("${mp.success-url:http://localhost:5173/success}")
    private String successUrl;
    @Value("${mp.failure-url:http://localhost:5173/failure}")
    private String failureUrl;
    @Value("${mp.pending-url:http://localhost:5173/pending}")
    private String pendingUrl;
    @Value("${mp.notification-url:}")
    private String notificationUrl;

    private final ProductoRepository productoRepository;
    private final RestTemplate rest = new RestTemplate();

    public CheckoutController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @PostMapping("/preference")
    public ResponseEntity<Map<String, Object>> crearPreferencia(@RequestBody CreatePreferenceReq req) {
        if (req == null || req.getItems() == null || req.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Carrito vacío");
        }

        final String sSuccess = successUrl == null ? "" : successUrl.trim();
        final String sFailure = failureUrl == null ? "" : failureUrl.trim();
        final String sPending = pendingUrl == null ? "" : pendingUrl.trim();

        final boolean successEsLocal = sSuccess.contains("localhost") || sSuccess.contains("127.0.0.1");

        List<Map<String, Object>> items = new ArrayList<>();
        Map<Integer, Integer> pedido = new LinkedHashMap<>();

        for (CartItem it : req.getItems()) {
            Integer id = it.getId();
            Integer qty = it.getQuantity();
            if (id == null || qty == null || qty <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item inválido");
            }

            Producto p = productoRepository.findById(id)
                    .orElseThrow(
                            () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto no existe: " + id));

            if (p.getStock() < qty) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock insuficiente para " + p.getNombre());
            }

            Map<String, Object> mpItem = new HashMap<>();
            mpItem.put("title", p.getNombre());
            mpItem.put("quantity", qty);
            mpItem.put("unit_price", p.getPrecio());
            mpItem.put("currency_id", "PEN");
            items.add(mpItem);

            pedido.put(p.getId(), qty);
        }

        Map<String, Object> backUrls = new HashMap<>();
        if (!sSuccess.isEmpty())
            backUrls.put("success", sSuccess);
        if (!sFailure.isEmpty())
            backUrls.put("failure", sFailure);
        if (!sPending.isEmpty())
            backUrls.put("pending", sPending);

        Map<String, Object> body = new HashMap<>();
        body.put("items", items);
        if (!backUrls.isEmpty()) {
            body.put("back_urls", backUrls);
        }

        if (!successEsLocal && !sSuccess.isEmpty()) {
            body.put("auto_return", "approved");
        } else {
            log.warn("auto_return omitido (success en localhost) para evitar 'invalid_auto_return' de MP");
        }

        if (notificationUrl != null && !notificationUrl.isBlank()) {
            body.put("notification_url", notificationUrl.trim());
        }

        body.put("metadata", Map.of("pedido", pedido));
        body.put("external_reference", UUID.randomUUID().toString());

        log.info("MP back_urls: {}", backUrls);
        log.info("MP auto_return: {}", body.get("auto_return"));

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            ResponseEntity<Map> mpResp = rest.postForEntity(
                    "https://api.mercadopago.com/checkout/preferences",
                    new HttpEntity<>(body, headers),
                    Map.class);

            Map<?, ?> r = mpResp.getBody();
            Map<String, Object> out = new HashMap<>();
            out.put("preferenceId", r != null ? r.get("id") : null);
            out.put("init_point", r != null ? r.get("init_point") : null);
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

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(@RequestParam Map<String, String> params,
            @RequestBody(required = false) Map<String, Object> body) {
        try {
            String type = params.getOrDefault("type", body != null ? String.valueOf(body.get("type")) : null);
            if (!"payment".equalsIgnoreCase(type))
                return ResponseEntity.ok().build();

            String paymentId = params.get("data.id");
            if (paymentId == null && body != null) {
                Object data = body.get("data");
                if (data instanceof Map<?, ?> m && m.get("id") != null) {
                    paymentId = String.valueOf(m.get("id"));
                }
            }
            if (paymentId == null)
                return ResponseEntity.ok().build();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            ResponseEntity<Map> payResp = rest.exchange(
                    "https://api.mercadopago.com/v1/payments/" + paymentId,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class);

            Map<?, ?> payment = payResp.getBody();
            if (payment == null)
                return ResponseEntity.ok().build();

            String status = String.valueOf(payment.get("status"));
            if (!"approved".equalsIgnoreCase(status))
                return ResponseEntity.ok().build();

            Object metaObj = payment.get("metadata");
            if (metaObj instanceof Map<?, ?> meta) {
                Object pedidoObj = meta.get("pedido");
                if (pedidoObj instanceof Map<?, ?> pedido) {
                    for (Map.Entry<?, ?> e : pedido.entrySet()) {
                        Integer pid = Integer.valueOf(String.valueOf(e.getKey()));
                        Integer qty = Integer.valueOf(String.valueOf(e.getValue()));
                        productoRepository.findById(pid).ifPresent(p -> {
                            p.setStock(p.getStock() - qty);
                            productoRepository.save(p);
                        });
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return ResponseEntity.ok().build();
    }

    public static class CreatePreferenceReq {
        private List<CartItem> items;

        public List<CartItem> getItems() {
            return items;
        }

        public void setItems(List<CartItem> items) {
            this.items = items;
        }
    }

    public static class CartItem {
        private Integer id;
        private Integer quantity;

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
