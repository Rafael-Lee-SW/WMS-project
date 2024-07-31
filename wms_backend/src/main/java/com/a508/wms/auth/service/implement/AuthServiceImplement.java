package com.a508.wms.auth.service.implement;

import com.a508.wms.auth.common.CertificationNumber;
import com.a508.wms.auth.domain.Certification;
import com.a508.wms.auth.dto.request.auth.CheckCertificationRequestDto;
import com.a508.wms.auth.dto.request.auth.EmailCertificationRequestDto;
import com.a508.wms.auth.dto.request.auth.IdCheckRequestDto;
import com.a508.wms.auth.dto.request.auth.SignInRequestDto;
import com.a508.wms.auth.dto.request.auth.SignUpRequestDto;
import com.a508.wms.auth.dto.response.ResponseDto;
import com.a508.wms.auth.dto.response.auth.CheckCertificationResponseDto;
import com.a508.wms.auth.dto.response.auth.EmailCertificationResponseDto;
import com.a508.wms.auth.dto.response.auth.IdCheckResponseDto;
import com.a508.wms.auth.dto.response.auth.SignInResponseDto;
import com.a508.wms.auth.dto.response.auth.SignUpResponseDto;
import com.a508.wms.auth.provider.EmailProvider;
import com.a508.wms.auth.repository.CertificationRepository;
import com.a508.wms.auth.service.AuthService;
import com.a508.wms.business.domain.Business;
import com.a508.wms.business.repository.BusinessRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {


    private final BusinessRepository businessRepository;
    private final EmailProvider emailProvider;
    private final CertificationRepository certificationRepository;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); //password Encorder 인터페이스

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

    /**
     * checkCertification 메서드는 사용자가 입력한 인증 정보(사용자 ID, 이메일, 인증 번호)를 기반으로
     * 데이터베이스에 저장된 인증 정보와 비교하여 인증을 검증
     * @param dto
     * @return
     */
    @Override
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(
        CheckCertificationRequestDto dto) {

        try {
            // 사용자 ID, 이메일, 인증 번호를 DTO로부터 가져옴
            String userId = dto.getId();  // 사용자 ID를 DTO로부터 가져옴
            String email = dto.getEmail();  // 이메일을 DTO로부터 가져옴
            String inputCertificationNumber = dto.getCertificationNumber();  // 인증 번호를 DTO로부터 가져옴

            // 사용자 ID를 기반으로 인증 정보를 데이터베이스에서 조회
            Certification certificationEntity = certificationRepository.findByUserId(userId);

            // 인증 정보가 없을 경우 인증 실패 응답 반환
            if (certificationEntity == null) {
                return CheckCertificationResponseDto.certificationFail();  // 인증 정보가 없으면 실패 응답 반환
            }

            // 저장된 이메일과 인증 번호가 입력된 이메일과 인증 번호와 일치하는지 검증
            boolean isSuccessed = certificationEntity.getEmail().equals(email) &&
                certificationEntity.getCertificationNumber().equals(inputCertificationNumber);

            // 인증 실패 시 응답 반환
            if (!isSuccessed) {
                return CheckCertificationResponseDto.certificationFail();  // 인증 정보가 일치하지 않으면 실패 응답 반환
            }

        } catch (Exception e) {
            // 예외 발생 시 예외 스택 트레이스 출력 및 데이터베이스 오류 응답 반환
            e.printStackTrace();
            return ResponseDto.databaseError();  // 예외 발생 시 데이터베이스 오류 응답 반환
        }

        // 인증 성공 시 성공 응답 반환
        return CheckCertificationResponseDto.success();  // 인증이 성공하면 성공 응답 반환
    }

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {
        try{
            String userEmail = dto.getEmail();
            boolean isExistId = businessRepository.existsByEmail(userEmail);
            if (isExistId) return SignUpResponseDto.duplicateId(); //나중에 수정필요

            String email = dto.getEmail();
            String certificationNumber = dto.getCertificationNumber();
            Certification certificationEntity = certificationRepository.findByEmail(userEmail);
            boolean isMatched = certificationEntity.getEmail().equals(email) &&
                certificationEntity.getCertificationNumber().equals(certificationNumber);
            if(!isMatched)return SignUpResponseDto.certificateFail();

            //암호화
            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);

            Business business = new Business(dto);
            businessRepository.save(business);
            // 데이터베이스에 Business 엔티티 저장

            certificationRepository.delete(certificationEntity);


            businessRepository.save(business);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return SignUpResponseDto.success();
    }



//    @Override
//    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {
//       String token = null;
//
//       try {
//           String userEmail = dto.getEmail();
//           Business
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseDto.databaseError();
//        }
//        return SignInResponseDto.success(token);
//    }
@Override
public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {
    return null;
}
}
