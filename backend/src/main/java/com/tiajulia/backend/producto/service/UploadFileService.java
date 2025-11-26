package com.tiajulia.backend.producto.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource; // Implementación de Resource que usa una URL
import org.springframework.stereotype.Service; // Marca esta clase como un servicio de Spring
import org.springframework.web.multipart.MultipartFile; // Archivo subido en la petición

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files; // Utilidades para operaciones de archivos
import java.nio.file.Path; // Interfaz para manejar rutas de archivos
import java.nio.file.Paths; // Para construir instancias de Path
import java.util.UUID; // Para generar nombres de archivo únicos

@Service
public class UploadFileService implements IUploadFileService {

    // Define la carpeta donde se guardarán los archivos
    private final static String UPLOADS_FOLDER = "uploads";

    // Método helper para obtener la ruta absoluta de un archivo dentro de UPLOADS_FOLDER
    private Path getPath(String filename) {
        // Combina la carpeta base con el nombre del archivo y obtiene la ruta absoluta
        return Paths.get(UPLOADS_FOLDER).resolve(filename).toAbsolutePath();
    }
    
    @Override
    // Implementación del método para copiar el archivo subido al disco
    public String copy(MultipartFile file) throws IOException {
        
        // Genera un nombre único anteponiendo un UUID al nombre original
        String uniqueFilename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        // Obtiene la ruta de destino completa para el nuevo archivo
        Path rootPath = getPath(uniqueFilename); 
        
        // Lógica para crear la carpeta 'uploads' si no existe
        File uploadDir = new File(UPLOADS_FOLDER);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Copia el contenido del archivo subido (InputStream) a la ruta de destino
        Files.copy(file.getInputStream(), rootPath);

        return uniqueFilename; // Devuelve el nombre único guardado en la BD
    }

    @Override
    // Implementación del método para cargar un archivo como un Spring Resource
    public Resource load(String filename) throws MalformedURLException {
        Path path = getPath(filename); // Obtiene la ruta absoluta del archivo

        System.out.println("DEBUG: Buscando archivo en la ruta: " + path.toAbsolutePath().toString());
        Resource resource = new UrlResource(path.toUri()); // Crea el recurso a partir de la ruta URI

        if (resource.exists() || resource.isReadable()) { // Verifica que el archivo exista y se pueda leer
            return resource; // Devuelve el recurso si es válido
        } else {
            // Lanza una excepción si no se pudo acceder al archivo
            throw new RuntimeException("No se pudo leer el archivo: " + filename);
        }
    }

    @Override
    // Implementación del método para eliminar un archivo
    public boolean delete(String filename) {
        Path rootPath = getPath(filename); // Obtiene la ruta del archivo a eliminar
        File archivo = rootPath.toFile(); // Convierte la ruta a un objeto File

        if (archivo.exists() && archivo.canWrite()) { // Verifica existencia y permisos de escritura
            return archivo.delete(); // Intenta eliminar el archivo
        }
        return false; // Devuelve falso si no existe o no se pudo eliminar
    }
    
    @Override
    public void deleteAll() {
    }
}