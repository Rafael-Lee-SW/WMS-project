package com.a508.wms.auth.service;

import com.a508.wms.auth.dto.request.auth.CheckCertificationRequestDto;
import com.a508.wms.auth.dto.request.auth.EmailCertificationRequestDto;
import com.a508.wms.auth.dto.request.auth.IdCheckRequestDto;
import com.a508.wms.auth.dto.request.auth.SignUpRequestDto;
import com.a508.wms.auth.dto.response.auth.CheckCertificationResponseDto;
import com.a508.wms.auth.dto.response.auth.EmailCertificationResponseDto;
import com.a508.wms.auth.dto.response.auth.IdCheckResponseDto;
import com.a508.wms.auth.dto.response.auth.SignUpResponseDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto);
    ResponseEntity<? super EmailCertificationResponseDto> emailCertification(
        EmailCertificationRequestDto dto);
   ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto);
   ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);



}
