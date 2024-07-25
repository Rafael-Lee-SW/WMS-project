package com.a508.wms.auth.service.implement;

import com.a508.wms.auth.dto.request.auth.IdCheckRequestDto;
import com.a508.wms.auth.dto.response.ResponseDto;
import com.a508.wms.auth.dto.response.auth.IdCheckResponseDto;
import com.a508.wms.auth.service.AuthService;
import com.a508.wms.business.domain.Business;
import com.a508.wms.business.repository.BusinessRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

    private final BusinessRepository businessRepository;
    @Override
    public ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto) {

        try{
            String userId = dto.getId();
            boolean isExistId = businessRepository.existsByUserId(Long.parseLong(userId));
            if(isExistId){ //중복이면
                return IdCheckResponseDto.duplicateId();
            }

        }catch(Exception e){
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return IdCheckResponseDto.success();

    }
}
