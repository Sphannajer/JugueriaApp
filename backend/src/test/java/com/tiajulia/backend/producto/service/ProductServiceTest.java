package com.tiajulia.backend.producto.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.InOrder;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tiajulia.backend.producto.model.Categoria;
import com.tiajulia.backend.producto.model.Producto;
import com.tiajulia.backend.producto.repository.ProductoRepository;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Clase de prueba para ProductoService.
 */
@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    // 1. Mocks de las dependencias
    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private IUploadFileService uploadFileService;

    // 2. Inyección de Mocks
    @InjectMocks
    private ProductoService productoService;

    // 3. Datos de Prueba
    private Producto productoSimulado;

    @BeforeEach
    void setUp() {
        // Este método se ejecuta antes de CADA prueba.
        Categoria categoriaSimulada = new Categoria();
        categoriaSimulada.setIdCategoria(1);
        categoriaSimulada.setNombre("Jugos");

        productoSimulado = new Producto();
        productoSimulado.setId(1);
        productoSimulado.setNombre("Jugo de Fresa");
        productoSimulado.setPrecio(10.0);
        productoSimulado.setStock(20);
        productoSimulado.setCategoria(categoriaSimulada);
        productoSimulado.setUrlImagen("imagen_a_borrar.jpg");
    }


    /**
     * PRUEBA 1
     * Verifica que el método 'findAll' devuelva correctamente
     * la lista de productos que le entrega el repositorio.
     */
    @Test
    void alLlamarFindAll_DebeRetornarListaDeProductos() {
        // 1. Arrange (Preparar)
        // Creamos una lista que contendrá nuestro producto simulado
        List<Producto> listaSimulada = new ArrayList<>();
        listaSimulada.add(productoSimulado);

        // "CUANDO se llame a productoRepository.findAll(),
        // ENTONCES retorna nuestra listaSimulada"
        when(productoRepository.findAll()).thenReturn(listaSimulada);

        // 2. Act (Actuar)
        // Llamamos al método que queremos probar
        List<Producto> resultado = productoService.findAll();

        // 3. Assert (Verificar)
        assertNotNull(resultado, "El resultado no debe ser nulo");
        assertEquals(1, resultado.size(), "El tamaño de la lista debe ser 1");
        assertEquals("Jugo de Fresa", resultado.get(0).getNombre(), "El nombre del producto no coincide");

        // Verificamos que el repositorio fue llamado exactamente 1 vez
        verify(productoRepository, times(1)).findAll();
    }

    /**
     * PRUEBA 2
     * Verifica que el método 'findById' devuelva un Optional con el producto
     * si el repositorio lo encuentra.
     */
    @Test
    void alBuscarPorIdExistente_DebeRetornarOptionalConProducto() {
        // 1. Arrange
        when(productoRepository.findById(1)).thenReturn(Optional.of(productoSimulado));

        // 2. Act
        Optional<Producto> resultado = productoService.findById(1);

        // 3. Assert
        assertTrue(resultado.isPresent(), "El Optional debería contener un producto");
        assertEquals(productoSimulado.getNombre(), resultado.get().getNombre(), "El producto encontrado no es el esperado");

        verify(productoRepository, times(1)).findById(1);
    }

    /**
     * PRUEBA 3
     * Verifica la lógica de 'delete'. Asegura que se intente borrar la imagen
     */
    @Test
    void alBorrarProductoConImagen_DebeBorrarImagenYLuegoProducto() {
        // 1. Arrange (Preparar)
        when(productoRepository.findById(1)).thenReturn(Optional.of(productoSimulado));


        // Creamos un 'InOrder' para verificar el orden de las llamadas a los mocks
        InOrder inOrder = inOrder(productoRepository, uploadFileService);

        // 2. Act (Actuar)
        productoService.delete(1);

        // 3. Assert (Verificar)

        // A) Primero, debe buscar el producto
        inOrder.verify(productoRepository, times(1)).findById(1);

        // B) Segundo, debe borrar la imagen
        inOrder.verify(uploadFileService, times(1)).delete("imagen_a_borrar.jpg");

        // C) Tercero, debe borrar el producto de la base de datos
        inOrder.verify(productoRepository, times(1)).deleteById(1);

        // Verificación extra, asegurarnos que no hubo MÁS interacciones
        verifyNoMoreInteractions(uploadFileService);
        verifyNoMoreInteractions(productoRepository);
    }
}