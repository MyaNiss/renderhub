package app.back.code.common.dto;

import lombok.Getter;

@Getter
public enum ErrorCodeEnum {
    INVALID_PARAMETER(400, "E400" , "매개변수가 잘못되었습니다."),
    INTERNAL_SERVER_ERROR(500, "E500", "서버에서 에러가 발생했습니다"),
    UN_AUTHORIZED_ERROR(401, "E401", "인증이 필요합니다."),

    FORBIDDEN_ERROR(403, "E403", "권한이 없습니다"),
    INVALID_TOKEN(401, "T401", "유효하지 않은 토큰입니다"),
    EXPIRED_TOKEN(401, "TE401", "만료된  토큰입니다"),
    NOT_FOUND(404, "E404", "찾을 수 없습니다.");


    private final  int status;
    private final String errorCode;
    private final String message;

    private ErrorCodeEnum(int status, String errorCode, String message) {
        this.status = status;
        this.errorCode = errorCode;
        this.message = message;
    }
}