package app.back.code.filter;

import app.back.code.common.utils.JWTUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.Arrays;

@RequiredArgsConstructor
public class CustomLogoutFilter  extends GenericFilterBean{

    private final JWTUtils jwtUtils;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
       
       process((HttpServletRequest)request, (HttpServletResponse) response, chain);
        
    }


    private void process(HttpServletRequest request, 
                        HttpServletResponse response,  
                        FilterChain chain ) throws IOException, ServletException {


        //요청한 경로 가져오기
        String requestURI = request.getRequestURI();
        String requestMethod = request.getMethod();


        //경로에 로그아웃이 없다면
        if(!requestURI.contains("logout")) {

            chain.doFilter(request, response);
            return;
        }

        String refreshToken ="";
        Cookie[] cookies = request.getCookies();

        response.setContentType("application/json");

        if(cookies == null) {
            chain.doFilter(request, response);
            return;
        }

        refreshToken = Arrays.stream(cookies)
                        .filter(cookie -> cookie.getName().equals("refresh"))
                        .map(Cookie::getValue)
                        .findAny().orElseThrow(()-> new IllegalStateException("없음"));

        if(refreshToken != null && !refreshToken.isEmpty()) {
            //Refresh 토큰 Cookie 값 0
            Cookie cookie = new Cookie("refresh", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            response.addCookie(cookie);
        }

        chain.doFilter(request, response);

    }


    

}
