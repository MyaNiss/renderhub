package app.back.code.common.handler;


import app.back.code.common.dto.ApiErrorResponse;
import app.back.code.common.dto.ErrorCodeEnum;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class CommonExceptionHandler {
    /**
     * 메서드 파라메터 항목이 틀렸을 경우
     * @ReuqestBody 일 때 @Valid 를 통해서 에러 남
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("==== MethodArgumentNotValidException : {} ====", e.getMessage());
        List< ApiErrorResponse.FileError> filedErrors =
                e.getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .map(ApiErrorResponse.FileError::error)
                        .toList();

        ApiErrorResponse apiErrorResponse = getApiErrorResponse(ErrorCodeEnum.INVALID_PARAMETER, filedErrors);

        return ResponseEntity
                .status(ErrorCodeEnum.INVALID_PARAMETER.getStatus())
                .body(apiErrorResponse);
    }

    /**
     *
     * @param e
     * @return
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolationException(ConstraintViolationException e) {
        log.error("==== ConstraintViolationException : {} ====", e.getMessage());
        List< ApiErrorResponse.FileError> filedErrors =
                e.getConstraintViolations()
                        .stream()
                        .map(ApiErrorResponse.FileError::error)
                        .toList();

        ApiErrorResponse apiErrorResponse = getApiErrorResponse(ErrorCodeEnum.INVALID_PARAMETER, filedErrors);

        return ResponseEntity
                .status(ErrorCodeEnum.INVALID_PARAMETER.getStatus())
                .body(apiErrorResponse);
    }

    /**
     * get > query String 방식에서 파라메터를 부여하지 않을 경우
     * @param e
     * @return
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    protected ResponseEntity<ApiErrorResponse>
    handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        log.error("==== MissingServletRequestParameterException : {} ====", e.getMessage());
        ApiErrorResponse.FileError fileError =
                ApiErrorResponse.FileError.error(e.getParameterName(), "",  e.getMessage());

        ApiErrorResponse apiErrorResponse =
                getApiErrorResponse(ErrorCodeEnum.INVALID_PARAMETER, List.of(fileError));

        return ResponseEntity
                .status(ErrorCodeEnum.INVALID_PARAMETER.getStatus())
                .body(apiErrorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        log.error("==== IllegalArgumentException : {} ====", e.getMessage());

        ApiErrorResponse apiErrorResponse = ApiErrorResponse
                .error("400", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(apiErrorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleException(Exception e) {
        log.error("==== Exception : {} ====", e.getMessage());
        ApiErrorResponse apiErrorResponse = getApiErrorResponse(ErrorCodeEnum.INTERNAL_SERVER_ERROR);

        return ResponseEntity.status(ErrorCodeEnum.INTERNAL_SERVER_ERROR.getStatus()).body(apiErrorResponse);
    }


    private ApiErrorResponse  getApiErrorResponse(ErrorCodeEnum errorCodeEnum) {
        return ApiErrorResponse
                .error(errorCodeEnum.getErrorCode(), errorCodeEnum.getMessage());
    }


    private ApiErrorResponse  getApiErrorResponse(ErrorCodeEnum errorCodeEnum,
                                                  List<ApiErrorResponse.FileError> fileErrors) {

        return ApiErrorResponse
                .error(errorCodeEnum.getErrorCode(), errorCodeEnum.getMessage(), fileErrors);
    }

}