package app.back.code.common.dto;

import app.back.code.common.utils.TimeFortmatUtils;
import lombok.Getter;

@Getter
public class ApiResponse<T> {
    private final String date;
    private final  String resultCode;
    private final  T content;

    private ApiResponse(String resultCode, T content) {
        this.resultCode = resultCode;
        this.content = content;
        this.date = TimeFortmatUtils.getNowTime();
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>("200", data);
    }

}