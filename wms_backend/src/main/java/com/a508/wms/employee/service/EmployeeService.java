package com.a508.wms.employee.service;

import com.a508.wms.employee.domain.Employee;
import com.a508.wms.employee.dto.EmployeeDto;
import com.a508.wms.employee.mapper.EmployeeMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeModuleService employeeModuleService;

    /**
     * 전체 직원을 조회하는 메서드
     *
     * @return List<EmployeeDto> (전체 직원)
     */
    public List<EmployeeDto> findAll() {
        List<Employee> employees = employeeModuleService.findAll();

        return employees.stream().map(EmployeeMapper::fromEmployee)
            .toList();
    }

    /**
     * 특정 직원 1명을 조회하는 메서드
     *
     * @param id : 직원의 고유 번호
     * @return employeeDto
     */
    public EmployeeDto findById(long id) {
        Employee employee = employeeModuleService.findById(id);
        return EmployeeMapper.fromEmployee(employee);
    }

    /**
     * 특정 사업체에 등록된 전체 직원의 정보를 조회하는 메서드
     *
     * @param businessId
     * @return List<EmployeeDto> (특정 사업체의 전체 직원)
     */
    public List<EmployeeDto> findByBusinessId(long businessId) {
        List<Employee> employees = employeeModuleService.findByBusinessId(businessId);

        return employees.stream().map(EmployeeMapper::fromEmployee)
            .toList();
    }


    /**
     * 직원 1명의 정보를 수정하는 메서드
     *
     * @param id          : 직원의 고유 번호
     * @param employeeDto : 변경할 직원의 정보
     * @return employeeDto : 변경된 직원의 정보
     */
    public EmployeeDto update(long id, EmployeeDto employeeDto) {
        //있는지 확인
        Employee employee = employeeModuleService.findById(id);

        employeeDto.setId(id);
        Employee updatedEmployee = employeeModuleService.save(EmployeeMapper.fromDto(employeeDto));

        return EmployeeMapper.fromEmployee(updatedEmployee);
    }

    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된것 처럼 처리.
     *
     * @param id : 직원의 고유 번호
     * @return employeeDto : 변경된 직원의 정보
     */
    public EmployeeDto delete(long id) {
        Employee employee = employeeModuleService.findById(id);
        Employee deletedEmployee = employeeModuleService.delete(employee);

        return EmployeeMapper.fromEmployee(deletedEmployee);
    }
}
