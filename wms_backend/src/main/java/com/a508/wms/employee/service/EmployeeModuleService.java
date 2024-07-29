package com.a508.wms.employee.service;

import com.a508.wms.employee.domain.Employee;
import com.a508.wms.employee.repository.EmployeeRepository;
import com.a508.wms.util.constant.StatusEnum;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeModuleService {

    private final EmployeeRepository employeeRepository;

    /**
     * 전체 직원을 조회하는 메서드
     *
     * @return List<EmployeeDto> (전체 직원)
     */
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    /**
     * 특정 직원 1명을 조회하는 메서드
     *
     * @param id : 직원의 고유 번호
     * @return employeeDto
     */
    public Employee findById(long id) {
        return employeeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid Employee ID: " + id));
    }

    /**
     * 특정 사업체에 등록된 전체 직원의 정보를 조회하는 메서드
     *
     * @param businessId
     * @return List<EmployeeDto> (특정 사업체의 전체 직원)
     */
    public List<Employee> findByBusinessId(long businessId) {
        return employeeRepository.findByBusinessId(businessId);
    }

    public Employee save(Employee employee) {
        return employeeRepository.save(employee);
    }


    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된것 처럼 처리.
     *
     * @param employee : 삭제하려는 직원 정보
     * @return employeeDto : 변경된 직원의 정보
     */
    public Employee delete(Employee employee) {
        employee.setStatusEnum(StatusEnum.DELETED);
        return save(employee);
    }
}
