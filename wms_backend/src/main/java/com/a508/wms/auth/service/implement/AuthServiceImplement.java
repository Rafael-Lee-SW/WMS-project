package com.a508.wms.auth.service.implement;

import com.a508.wms.auth.common.CertificationNumber;
import com.a508.wms.auth.domain.Certification;
import com.a508.wms.auth.dto.request.auth.EmailCertificationRequestDto;
import com.a508.wms.auth.dto.request.auth.IdCheckRequestDto;
import com.a508.wms.auth.dto.response.ResponseDto;
import com.a508.wms.auth.dto.response.auth.EmailCertificationResponseDto;
import com.a508.wms.auth.dto.response.auth.IdCheckResponseDto;
import com.a508.wms.auth.provider.EmailProvider;
import com.a508.wms.auth.repository.CertificationRepository;
import com.a508.wms.auth.service.AuthService;
import com.a508.wms.business.repository.BusinessRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

    private final BusinessRepository businessRepository;
    private final EmailProvider emailProvider;
    private final CertificationRepository certificationRepository;

    /**
     * 사용자 이메일 중복 여부를 확인합니다.
     *
     * @param dto 사용자 이메일 체크 요청 DTO
     * @return 중복 여부에 따른 응답 엔터티
     */
    @Override
    public ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto) {
        log.info("idCheck method called with dto: {}", dto);
        try {
            // 사용자 이메일을 가져옴
            String email = dto.getId();
            log.info("Checking email for duplication: {}", email);

            // 사용자 이메일 중복 여부 확인
            boolean isExistEmail = businessRepository.existsByEmail(email);
            if (isExistEmail) { // 중복이면
                log.info("Email already exists: {}", email);
                return IdCheckResponseDto.duplicateId();
            }
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("Error during email duplication check", e);
            return ResponseDto.databaseError();
        }
        // 중복이 아닌 경우 성공 응답 반환
        log.info("Email is available: {}", dto.getId());
        return IdCheckResponseDto.success();
    }

    /**
     * 이메일 인증을 처리합니다.
     *
     * @param dto 이메일 인증 요청 DTO
     * @return 이메일 인증 처리 결과 응답 엔터티
     */
    @Override
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto) {
        log.info("emailCertification method called with dto: {}", dto);
        try {
            // 사용자 ID와 이메일을 가져옴
            String userId = dto.getId();
            String email = dto.getEmail();
            log.info("Processing email certification for userId: {} and email: {}", userId, email);

            // 사용자 ID 중복 여부 확인
            boolean isExistId = businessRepository.existsByEmail(email);
            if (isExistId) {
                log.info("Email already exists: {}", email);
                return EmailCertificationResponseDto.duplicatedId();
            }

            // 인증 번호 생성
            String certificationNumber = CertificationNumber.getCertificationNumber();
            log.info("Generated certification number: {}", certificationNumber);

            // 인증 이메일 발송
            boolean isSuccessed = emailProvider.sendCertificationMail(email, certificationNumber);
            if (!isSuccessed) {
                log.error("Failed to send certification email to: {}", email);
                return EmailCertificationResponseDto.mailSendFail();
            }

            // 인증 정보를 저장
            Certification certification = new Certification(userId, email, certificationNumber);
            certificationRepository.save(certification);
            log.info("Saved certification info for userId: {} and email: {}", userId, email);

        } catch (NumberFormatException e) {
            // 사용자 ID가 유효하지 않은 경우 예외 처리
            log.error("Invalid userId format: {}", dto.getId(), e);
            return ResponseDto.validationFail();
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("Error during email certification process", e);
            return ResponseDto.databaseError();
        }
        // 이메일 인증 성공 응답 반환
        log.info("Email certification succeeded for userId: {} and email: {}", dto.getId(), dto.getEmail());
        return EmailCertificationResponseDto.success();
    }
}
