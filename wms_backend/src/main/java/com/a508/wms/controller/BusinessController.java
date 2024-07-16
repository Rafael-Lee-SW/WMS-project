package com.a508.wms.controller;

import com.a508.wms.domain.Business;
import com.a508.wms.dto.BusinessDto;
import com.a508.wms.service.BusinessService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/businesses")
@Tag(name = "사업체 관리", description = "사업체의 CRUD 관리")
public class BusinessController {

    private final BusinessService businessService;
    @Autowired
    public BusinessController(BusinessService businessService) {
        this.businessService = businessService;
    }
    @GetMapping
    public List<BusinessDto> getBusinesses() {
        return businessService.getAllBusiness();
    }
    @GetMapping("/{id}")
    public BusinessDto getBusiness(@PathVariable long id) {
        return businessService.getBusinessById(id);
    }
    @PostMapping
    public BusinessDto createBusiness(@RequestBody BusinessDto businessDto) {
        return businessService.createBusiness(businessDto);
    }
    @PutMapping("/{id}")
    public BusinessDto updateBusiness(@PathVariable long id, @RequestBody BusinessDto businessDto) {
        return businessService.updateBusiness(id, businessDto);
    }
    /*@PatchMapping("/{id}")
    public BusinessDto patchBusiness(@PathVariable long id, @RequestBody BusinessDto businessDto) {
        return businessService.deleteBusiness(id, businessDto);
    }*/

}
