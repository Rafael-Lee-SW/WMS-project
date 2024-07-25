package com.a508.wms.business.controller;

import com.a508.wms.business.dto.BusinessDto;
import com.a508.wms.business.service.BusinessService;
import com.a508.wms.util.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/businesses")
@Tag(name = "사업체 관리", description = "사업체의 CRUD 관리")
public class BusinessController {

    private final BusinessService businessService;

    @Autowired
    public BusinessController(BusinessService businessService) {
        this.businessService = businessService;
    }

    /**
     * 모든 사업체의 정보를 조회하는 메서드
     *
     * @return List<BusinessDto>
     */
    @GetMapping
    public BaseSuccessResponse<?> getBusinesses() {
        return new BaseSuccessResponse<>(businessService.findAll());
    }

    /**
     * 특정 id를 가진 사업체의 정보를 조회하는 메서드
     *
     * @param id : 사업체 고유 번호
     * @return BusinessDto
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<?> getBusiness(@PathVariable long id) {
        return new BaseSuccessResponse<>(businessService.findById(id));
    }

    /**
     * 테스트용 사업체 생성 메서드로, 나중에는 사용되지 않을 예정
     *
     * @param businessDto : 사업체의 정보가 담긴 Dto
     * @return
     */
    @PostMapping
    public BaseSuccessResponse<?> createBusiness(@RequestBody BusinessDto businessDto) {
        return new BaseSuccessResponse<>(businessService.create(businessDto));
    }

    /**
     * 사업체의 정보를 수정하는 메서드 현재 수정 가능한 부분은 사업체에 관한 개인 정보들(사업체 번호, 이름,이메일 등..)
     *
     * @param id          : 사업체 고유 번호
     * @param businessDto : 사업체 정보가 담긴 Dto
     * @return BusinessDto
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<?> updateBusiness(@PathVariable long id,
        @RequestBody BusinessDto businessDto) {
        return new BaseSuccessResponse<>(businessService.update(businessDto));
    }

    /**
     * 사업체의 정보를 삭제하는 메서드 실제로 지우지 않고, 상태를 DELETED로 변경하여 삭제된 것 처럼 처리
     *
     * @param id : 사업체 고유 번호
     * @return BusinessDto
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<?> deleteBusiness(@PathVariable long id) {
        return new BaseSuccessResponse<>(businessService.delete(id));
    }

}
