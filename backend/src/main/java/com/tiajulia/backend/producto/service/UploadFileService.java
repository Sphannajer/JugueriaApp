package com.tiajulia.backend.producto.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UploadFileService implements IUploadFileService {

    private final static String UPLOADS_FOLDER = "uploads";

    private Path getPath(String filename) {
        return Paths.get(UPLOADS_FOLDER).resolve(filename).toAbsolutePath();
    }
    
    @Override
    public String copy(MultipartFile file) throws IOException {
        
        String uniqueFilename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        Path rootPath = getPath(uniqueFilename); 
        
        File uploadDir = new File(UPLOADS_FOLDER);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        Files.copy(file.getInputStream(), rootPath);

        return uniqueFilename;
    }

    @Override
    public Resource load(String filename) throws MalformedURLException {
        Path path = getPath(filename);

        System.out.println("DEBUG: Buscando archivo en la ruta: " + path.toAbsolutePath().toString());
        Resource resource = new UrlResource(path.toUri());

        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("No se pudo leer el archivo: " + filename);
        }
    }

    @Override
    public boolean delete(String filename) {
        Path rootPath = getPath(filename);
        File archivo = rootPath.toFile();

        if (archivo.exists() && archivo.canWrite()) {
            return archivo.delete();
        }
        return false;
    }
    
    @Override
    public void deleteAll() {
    }
}