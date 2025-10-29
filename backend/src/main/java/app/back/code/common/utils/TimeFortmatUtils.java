package app.back.code.common.utils;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class TimeFortmatUtils {

    private static  final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

    public static String getNowTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATE_FORMAT));
    }

    /**
     * LocalDateTime -> String
     * @param localDateTime
     * @return
     */
    public static String getTime(LocalDateTime localDateTime, String pattern) {
        pattern = pattern == null ? DATE_FORMAT : pattern;
        return localDateTime.format(DateTimeFormatter.ofPattern(pattern));
    }

    /**
     * LocalDateTime -> String
     * @param localDateTime
     * @return
     */
    public static String getTime(LocalDateTime localDateTime) {
        return localDateTime.format(DateTimeFormatter.ofPattern(DATE_FORMAT));
    }
}
