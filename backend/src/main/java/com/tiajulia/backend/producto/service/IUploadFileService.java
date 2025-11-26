package com.tiajulia.backend.producto.service;

import org.springframework.core.io.Resource; // Clase de Spring para representar un recurso de bajo nivel (archivo)
import org.springframework.web.multipart.MultipartFile; // Clase para manejar archivos subidos desde una petición HTTP

import java.net.MalformedURLException; // Excepción para manejar URLs mal formadas
import java.io.IOException; // Excepción para errores de entrada/salida (al copiar archivos)

// Interfaz que define las operaciones de manejo de archivos (subida, carga, eliminación)
public interface IUploadFileService {

    // Contrato para copiar el archivo MultipartFile al sistema de archivos local
    public String copy(MultipartFile file) throws IOException; // Devuelve el nombre o ruta del archivo guardado

    // Contrato para cargar un archivo por su nombre y devolverlo como un Spring Resource
    public Resource load(String filename) throws MalformedURLException;

    // Contrato para eliminar un archivo del sistema de archivos
    public boolean delete(String filename); // Devuelve true si la eliminación fue exitosa
    
    // Contrato para eliminar todos los archivos (utilizado generalmente para inicializar o limpiar)
    public void deleteAll();
}