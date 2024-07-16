package com.a508.wms.service;

import com.a508.wms.domain.Business;
import com.a508.wms.dto.BusinessDto;
import com.a508.wms.dto.EmployeeDto;
import com.a508.wms.repository.BusinessRepository;
import com.a508.wms.util.StatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class BusinessService {

    @Autowired
    private BusinessRepository businessRepository;

    public BusinessService() {}

    // business 테이블에 사업체를 추가
    public BusinessDto createBusiness(BusinessDto businessDto) {
        Business.Builder builder = new Business.Builder()
                .email(businessDto.getEmail())
                .password(businessDto.getPassword());
//        사업자명 입력하는 경우
        if(businessDto.getName() != null) {
            builder.name(businessDto.getName());
        }
        if(businessDto.getBusinessNumber() != null) {
            builder.businessNumber(businessDto.getBusinessNumber());
        }
        Business business = builder.build();
        try {
            Business savedBusiness = businessRepository.save(business);
            return BusinessDto.toBusinessDto(savedBusiness);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // business 테이블에서 id로 조회
    public BusinessDto getBusinessById(long id) {
        try {
            Business business = businessRepository.getReferenceById(id);
            if (business.getStatusEnum() != StatusEnum.ACTIVE) {
                throw new Exception("해당 id는 활성화 상태가 아닙니다.");
            }
            return BusinessDto.toBusinessDto(business);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // business 테이블에서 모든 사업체 조회
    public List<BusinessDto> getAllBusiness() {
        try {
            List<Business> businesses = businessRepository.findAll();
            return businesses.stream().map(BusinessDto::toBusinessDto).toList();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // business 테이블에서 특정 사업체 수정
    public BusinessDto updateBusiness(long id, BusinessDto businessDto) {
        try {
//            1. 기존 Business 컬럼 불러오기
            Business existingBusiness = businessRepository.getReferenceById(id);
            if (existingBusiness.getStatusEnum() != StatusEnum.ACTIVE) {
                throw new Exception("해당 id는 활성화 상태가 아닙니다.");
            }
//            2. 수정할 필드 값 변경하기
            Business.Builder builder = new Business.Builder();
            if(businessDto.getName() != null) {
                builder.email(businessDto.getEmail());
            }
            if(businessDto.getPassword() != null) {
                builder.password(businessDto.getPassword());
            }
            if(businessDto.getName() != null) {
                builder.name(businessDto.getName());
            }
            if(businessDto.getBusinessNumber() != null) {
                builder.businessNumber(businessDto.getBusinessNumber());
            }
                builder.employees(existingBusiness.getEmployees());
            Business updatedBusiness = builder.build();
//            3. 변경 후 return
            return BusinessDto.toBusinessDto(updatedBusiness);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    // business 테이블에서 특정 사업체 삭제(상태를 변경해서 넘기기)
    /*public BusinessDto deleteBusiness(long id, BusinessDto businessDto) {
        try {
            Business existingBusiness = businessRepository.getReferenceById(id);
            if (existingBusiness.getStatusEnum() != StatusEnum.활성) {
                throw new Exception("해당 id는 활성화 상태가 아닙니다.");
            }
            businessDto.setStatus(String.valueOf(StatusEnum.삭제));
            Business deletedBusiness = businessRepository.save(convertToBusiness(id, businessDto));
            return convertToDTO(deletedBusiness);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }*/

}
