package app.back.code.file.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class StorageService {
    @Value("${file.base.path}")
    private String baseUploadPath;


    private static final String UPLOADS_URL_ROOT = "/uploads/";

    public String saveFile(MultipartFile file, String fileUseType, String subDirName) throws Exception {
        if(file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }
        if(subDirName == null || subDirName.isEmpty()) {
            subDirName = fileUseType;
        }

        String fileName = file.getOriginalFilename();
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        String randName = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 16);
        String storedFileName = randName + "." + extension;

        String storedPath = fileUseType + "/" + subDirName + "/" + storedFileName;

        Path targetLocation = Paths.get(baseUploadPath, fileUseType, subDirName, storedFileName);
        File newFile = targetLocation.toFile();

        if( !newFile.getParentFile().exists()) {
            newFile.getParentFile().mkdirs();
        }

        file.transferTo(newFile);

        return storedPath;
    }

    public String getPublicUrl(String storedPath) {
        return UPLOADS_URL_ROOT + storedPath;
    }

    public boolean deleteFile(String storedPath) {
        if(storedPath == null || storedPath.trim().isEmpty()) {
            return false;
        }

        Path filePath = Paths.get(baseUploadPath, storedPath);
        File fileToDelete = filePath.toFile();

        if(fileToDelete.exists() && fileToDelete.isFile()) {
            return fileToDelete.delete();
        }

        return false;
    }
}
