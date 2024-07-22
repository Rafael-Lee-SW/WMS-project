package com.a508.wms.service;

import com.a508.wms.domain.Business;
import com.a508.wms.dto.BusinessDto;
import com.a508.wms.repository.BusinessRepository;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.util.mapper.BusinessMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.a508.wms.util.mapper.BusinessMapper.fromBusiness;
import static com.a508.wms.util.mapper.BusinessMapper.fromDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class BusinessService {
    private final BusinessRepository businessRepository;

    /**
     * 테스트용 사업체 생성 메서드로, 나중에는 사용되지 않을 예정
     *
     * @param businessDto : 사업체의 정보가 담긴 Dto
     * @return
     */
    public BusinessDto create(BusinessDto businessDto) {
        Business.BusinessBuilder builder = Business.builder()
                .email(businessDto.getEmail())
                .password(businessDto.getPassword());
//        사업자명 입력하는 경우
        if (businessDto.getName() != null) {
            builder.name(businessDto.getName());
        }
        if (businessDto.getBusinessNumber() != null) {
            builder.businessNumber(businessDto.getBusinessNumber());
        }
        Business business = builder.build();
        try {
            Business savedBusiness = businessRepository.save(business);
            return fromBusiness(savedBusiness);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 특정 id를 가진 사업체의 정보를 조회하는 메서드
     *
     * @param id : 사업체 고유 번호
     * @return BusinessDto
     */
    public BusinessDto findById(long id) {
        try {
            Business business = businessRepository.getReferenceById(id);
            if (business.getStatusEnum() != StatusEnum.ACTIVE) {
                throw new Exception("해당 id는 활성화 상태가 아닙니다.");
            }
            return fromBusiness(business);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 모든 사업체의 정보를 조회하는 메서드
     *
     * @return List<BusinessDto>
     */
    public List<BusinessDto> findAll() {
        List<Business> businesses = businessRepository.findAll();
        return businesses.stream()
                .map(BusinessMapper::fromBusiness)
                .toList();
    }


    /**
     * 사업체의 정보를 수정하는 메서드
     * 현재 수정 가능한 부분은 사업체에 관한 개인 정보들(사업체 번호, 이름,이메일 등..)
     *
     * @param id          : 사업체 고유 번호
     * @param businessDto : 사업체 정보가 담긴 Dto
     * @return BusinessDto
     */
    public BusinessDto update(long id, BusinessDto businessDto) {
        try {
//            1. 기존 Business 컬럼 불러오기
            Business existingBusiness = businessRepository.getReferenceById(id);
            if (existingBusiness.getStatusEnum() != StatusEnum.ACTIVE) {
                throw new Exception("해당 id는 활성화 상태가 아닙니다.");
            }
//            2. 수정할 필드 값 변경하기
            Business updatedBusiness = businessRepository.save(fromDto(businessDto));
//            3. 변경 후 return
            return BusinessMapper.fromBusiness(updatedBusiness);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 사업체의 정보를 삭제하는 메서드
     * 실제로 지우지 않고, 상태를 DELETED로 변경하여 삭제된 것 처럼 처리
     *
     * @param id : 사업체 고유 번호
     * @return BusinessDto
     */
    public BusinessDto delete(long id) {
        try {
//            1. 기존 Business 컬럼 불러오기
            Business existingBusiness = businessRepository.getReferenceById(id);
            if (existingBusiness.getStatusEnum() != StatusEnum.ACTIVE) {
                throw new Exception("해당 id는 활성화 상태가 아닙니다.");
            }
//            2. 삭제할 필드 값 변경하기
            existingBusiness.setStatusEnum(StatusEnum.DELETED);

            Business deletedBusiness = businessRepository.save(existingBusiness);
//             3. 변경 후 return
            return fromBusiness(deletedBusiness);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
