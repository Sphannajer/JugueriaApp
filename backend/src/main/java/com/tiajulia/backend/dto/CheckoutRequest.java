package com.tiajulia.backend.dto;

// Import necesario
import java.util.List;

// Esta clase actúa como molde para los datos que llegan del frontend (Estructura de Datos - DTO).
// Le dice a Spring Boot que convierta el JSON que envía JavaScript (producto.Api.js) en un objeto java que el CheckoutController pueda entender y manipular.
public class CheckoutRequest {
    private List<Item> items; // Declara la variable items que almacenará una lista de objetos tipo Item.
    // Método que se usará en el controlador para leer y procesar la venta.

    public List<Item> getItems() {
        return items;
    }

    // Método que usa Spring Boot cuando recibe el mensaje del frontend.
    // Toma la lista de productos del JSON y lo guarda dentro de la variable
    // "items".
    public void setItems(List<Item> items) {
        this.items = items;
    }

    // Clase anidada que define la estructura de un producto dentro del carrito,
    // diciéndole al sistema qué datos debe tener obligatoriamente.
    public static class Item {
        private Integer id; // Pide ID para saber qué producto es.
        private Integer quantity; // Pide Cantidad para saber cuántos productos quiere el usuario

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
