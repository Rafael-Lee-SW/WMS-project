package com.a508.wms.controller;

import com.a508.wms.domain.Employee;
import com.a508.wms.dto.EmployeeDto;
import com.a508.wms.service.EmployeeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@Tag(name = "직원 관리", description = "직원의 CRUD 관리")
public class EmployeeController {
    EmployeeService employeeService;

    @Autowired
    EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /**
     * 전체 직원 혹은 특정 사업체의 전체 직원을 조회하는 메서드
     * @param businessId : 특정 사업체의 전체 직원을 조회하는 경우 사업체 고유 번호 입력
     * @return List<EmployeeDto> (전체 직원),
     *         List<EmployeeDto> (특정 사업체의 전체 직원)
     */
    @GetMapping
    public ResponseEntity<?> getEmployees(@RequestParam(value = "businessid", required = false) String businessId) {
        if (businessId != null) {
            List<EmployeeDto> employees = employeeService.getEmployeeByBusinessId(Long.parseLong(businessId));
            return new ResponseEntity<>(employees, HttpStatus.OK);
        } else {
            List<EmployeeDto> employeeSummaries = employeeService.getAllEmployees();
            return new ResponseEntity<>(employeeSummaries, HttpStatus.OK);
        }
    }

    /**
     * 특정 직원 1명을 조회하는 메서드
     * @param id : 직원의 고유 번호
     * @return employeeDto
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable("id") long id) {
        return new ResponseEntity<>(employeeService.getEmployeeById(id), HttpStatus.OK);
    }

    /**
     * 직원 1명의 정보를 수정하는 메서드
     * @param id : 직원의 고유 번호
     * @param employeeDto : 변경할 직원의 정보
     * @return employeeDto : 변경된 직원의 정보
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable("id") long id, @RequestBody EmployeeDto employeeDto) {
        return new ResponseEntity<>(employeeService.updateEmployee(id, employeeDto), HttpStatus.OK);
    }

    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된 것 처럼 처리.
     * @param id : 직원의 고유 번호
     * @return employeeDto : 변경된 직원의 정보
     */
    @PatchMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable("id") long id) {
        return new ResponseEntity<>(employeeService.deleteEmployee(id), HttpStatus.OK);
    }
}
