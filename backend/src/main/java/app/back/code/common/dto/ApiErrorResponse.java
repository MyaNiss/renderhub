package app.back.code.common.dto;

import app.back.code.common.utils.TimeFortmatUtils;
import jakarta.validation.ConstraintViolation;
import lombok.Getter;
import org.springframework.validation.FieldError;

import java.util.List;

@Getter
public class ApiErrorResponse {

    private final  String code;
    private final String message;
    private final String date;
    private final List<FileError> fileErrors;

    private ApiErrorResponse(String code, String message, List<FileError> fileErrors) {
        this.code = code;
        this.message = message;
        this.date = TimeFortmatUtils.getNowTime();
        this.fileErrors = fileErrors;
    }

    public static ApiErrorResponse error(String code, String message) {
        return new ApiErrorResponse(code, message, null);
    }


    public static ApiErrorResponse error(String code, String message, List<FileError> fileErrors) {
        return new ApiErrorResponse(code, message, fileErrors);
    }


    @Getter
    public static class FileError{
        private final String filed;
        private final String value;
        private final String message;

        private FileError(String filed, String value, String message) {
            this.filed = filed;
            this.value = value;
            this.message = message;
        }


        public static FileError error(FieldError fieldError) {
            return new FileError(
                    fieldError.getField(),
                    fieldError.getRejectedValue() == null ? "" : fieldError.getRejectedValue().toString(),
                    fieldError.getDefaultMessage());
        }

        public static FileError error(ConstraintViolation<?>  fieldError) {
            String fieldName = fieldError.getPropertyPath().toString();
            fieldName  = fieldName.substring(fieldName.lastIndexOf(".")+1);

            return new FileError(
                    fieldName,
                    fieldError.getInvalidValue() == null ? "" : fieldError.getInvalidValue().toString(),
                    fieldError.getMessage());
        }

        public static FileError error(String fieldName, String value, String message) {
            return new FileError(fieldName,value,  message);
        }
    }
}