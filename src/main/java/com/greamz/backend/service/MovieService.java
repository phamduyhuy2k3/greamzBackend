package com.greamz.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.greamz.backend.common.BaseEntityService;
import com.greamz.backend.dto.FileUpload;
import com.greamz.backend.model.GameModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service

public class MovieService {
    @Autowired
    private Cloudinary cloudinary;

    public Optional<Map> uploadMovie(FileUpload fileUpload) {
        if (fileUpload.getFile() == null || fileUpload.getFile().isEmpty())
            return Optional.empty();
        Map uploadResult = null;
        try {
            uploadResult = cloudinary.uploader().upload(fileUpload.getFile().getBytes(),
                    ObjectUtils.asMap("resource_type", "auto"));
        } catch (IOException e) {
            return Optional.empty();
        }
        fileUpload.setPublicId((String) uploadResult.get("public_id"));
        Object version = uploadResult.get("version");
        if (version instanceof Integer) {

            fileUpload.setVersion(Long.valueOf((Integer) version));
        } else {
            fileUpload.setVersion((Long) version);
        }

        fileUpload.setSignature((String) uploadResult.get("signature"));
        fileUpload.setFormat((String) uploadResult.get("format"));
        fileUpload.setResourceType((String) uploadResult.get("resource_type"));

        return Optional.of(uploadResult);
    }


}
