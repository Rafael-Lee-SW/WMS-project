package com.a508.wms.auth.service;

import com.a508.wms.auth.dto.request.auth.IdCheckRequestDto;
import com.a508.wms.auth.dto.response.auth.IdCheckResponseDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto);



}
