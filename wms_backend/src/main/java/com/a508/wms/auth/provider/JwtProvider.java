package com.a508.wms.auth.provider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys; // Keys 클래스를 import 합니다.
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtProvider {

    @Value("${secret-key}")
    private String secretKey;

    /**
     * @param userId
     * @return
     * jwt 생성하는 메서드
     * 유효기간 , signature
     */
    public String create(String userId){
        Date expiredDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)); // 수정: Keys 클래스의 hmacShaKeyFor 메서드 사용

        String jwt = Jwts.builder()
            .signWith(key, SignatureAlgorithm.HS256) // 수정: HS256 알고리즘 사용
            .setSubject(userId).setIssuedAt(new Date()).setExpiration(expiredDate)
            .compact();
        /**
         * { "iat" : 1551515
         *   "exp" : 12355454
         *   }
         */
        return jwt;
    }

    /**
     *
     * @param jwt
     * @return
     * 검증
     */
    public String validate(String jwt){
        String subject = null;
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)); // 수정: Keys 클래스의 hmacShaKeyFor 메서드 사용

        try{
            subject = Jwts.parserBuilder()
                .setSigningKey(key) // 수정: setSigningKey 메서드 사용
                .build()
                .parseClaimsJws(jwt)
                .getBody()
                .getSubject();

        }catch (Exception exception){
            exception.printStackTrace();
            return null;
        }
        return subject;
    }
}
