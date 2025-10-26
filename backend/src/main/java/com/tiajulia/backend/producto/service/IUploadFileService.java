package com.tiajulia.backend.producto.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.io.IOException;

public interface IUploadFileService {

    public String copy(MultipartFile file) throws IOException;

    public Resource load(String filename) throws MalformedURLException;

    public boolean delete(String filename);
    
    public void deleteAll();
}