package com.a508.wms.employee.controller;

import com.a508.wms.employee.dto.EmployeeDto;
import com.a508.wms.employee.service.EmployeeService;
import com.a508.wms.util.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@Tag(name = "직원 관리", description = "직원의 CRUD 관리")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;


    /**
     * 전체 직원 혹은 특정 사업체의 전체 직원을 조회하는 메서드
     *
     * @param businessId : 특정 사업체의 전체 직원을 조회하는 경우 사업체 고유 번호 입력
     * @return List<EmployeeDto> (전체 직원), List<EmployeeDto> (특정 사업체의 전체 직원)
     */
    @GetMapping
    public BaseSuccessResponse<List<EmployeeDto>> getEmployees(
        @RequestParam(value = "businessId", required = false) Long businessId) {
        if (businessId != null) {
            return new BaseSuccessResponse<>(employeeService.findByBusinessId(businessId));
        } else {
            return new BaseSuccessResponse<>(employeeService.findAll());
        }
    }

    /**
     * 특정 직원 1명을 조회하는 메서드
     *
     * @param id : 직원의 고유 번호
     * @return employeeDto
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<EmployeeDto> getEmployee(@PathVariable("id") long id) {
        return new BaseSuccessResponse<>(employeeService.findById(id));
    }

    /**
     * 직원 1명의 정보를 수정하는 메서드
     *
     * @param id          : 직원의 고유 번호
     * @param employeeDto : 변경할 직원의 정보
     * @return employeeDto : 변경된 직원의 정보
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<?> updateEmployee(@PathVariable("id") long id,
        @RequestBody EmployeeDto employeeDto) {
        return new BaseSuccessResponse<>(employeeService.update(id, employeeDto));
    }

    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된 것 처럼 처리.
     *
     * @param id : 직원의 고유 번호
     * @return employeeDto : 변경된 직원의 정보
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<?> deleteEmployee(@PathVariable("id") long id) {
        return new BaseSuccessResponse<>(employeeService.delete(id));
    }
}
