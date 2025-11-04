package app.back.code.common.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomLogoutHandler implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        JSONObject obj = new JSONObject();

        try {
            obj.put("resultCode", 200);
            obj.put("resultMsg", "OK");

            response.getWriter().write(obj.toString());
            response.getWriter().flush();
        }catch (Exception e){
            throw new RuntimeException("로그아웃 에러");
        }
    }
}
