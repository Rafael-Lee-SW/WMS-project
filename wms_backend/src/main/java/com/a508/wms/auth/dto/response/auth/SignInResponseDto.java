package com.a508.wms.auth.dto.response.auth;

import com.a508.wms.auth.common.ResponseCode;
import com.a508.wms.auth.common.ResponseMessage;
import com.a508.wms.auth.dto.response.ResponseDto;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.dto.UserResponseDto;
import com.a508.wms.user.mapper.UserMapper;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class SignInResponseDto extends ResponseDto {
    private String token;
    private int expirationTime;
    private UserResponseDto user;

    private SignInResponseDto(String token, User user) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.token = token;
        this.expirationTime = 1800; // 30분
        this.user = UserMapper.toUserResponseDto(user); // Convert User to UserResponseDto
    }

    public static ResponseEntity<SignInResponseDto> success(String token, User user) {
        SignInResponseDto responseDto = new SignInResponseDto(token, user);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    public static ResponseEntity<ResponseDto> signInFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL, ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }
}
