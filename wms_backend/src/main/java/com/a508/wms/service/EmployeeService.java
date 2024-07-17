package com.a508.wms.service;

import com.a508.wms.domain.Employee;
import com.a508.wms.dto.EmployeeDto;
import com.a508.wms.repository.EmployeeRepository;
import com.a508.wms.util.StatusEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    private static final Logger log = LoggerFactory.getLogger(EmployeeService.class);
    @Autowired
    private EmployeeRepository employeeRepository;

    public EmployeeService() {}
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * 전체 직원을 조회하는 메서드
     * @return List<EmployeeDto> (전체 직원)
     */
    public List<EmployeeDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream().map(EmployeeDto::toEmployeeDto).toList();
    }

    /**
     * 특정 직원 1명을 조회하는 메서드
     * @param id : 직원의 고유 번호
     * @return employeeDto
     */
    public EmployeeDto getEmployeeById(long id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        return employee.map(EmployeeDto::toEmployeeDto).orElse(null);
    }

    /**
     * 특정 사업체에 등록된 전체 직원의 정보를 조회하는 메서드
     * @param businessId
     * @return List<EmployeeDto> (특정 사업체의 전체 직원)
     */
    public List<EmployeeDto> getEmployeeByBusinessId(long businessId) {
        List <Employee> employees = employeeRepository.findByBusinessId(businessId);
        return employees.stream().map(EmployeeDto::toEmployeeDto).toList();
    }
    /**
     * 직원 1명의 정보를 수정하는 메서드
     * @param id : 직원의 고유 번호
     * @param employeeDto : 변경할 직원의 정보
     * @return employeeDto : 변경된 직원의 정보
     */
    public EmployeeDto updateEmployee(long id, EmployeeDto employeeDto) {
        Employee employee = employeeRepository.getReferenceById(id);

        try {
            if(employee.getStatusEnum() != StatusEnum.ACTIVE)
            {
                throw new Exception("해당 id는 활성화 상태가 아닙니다.");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        Employee updatedEmployee = employeeRepository.save(employee.toEmployee(employeeDto));
        return EmployeeDto.toEmployeeDto(updatedEmployee);
    }

    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된것 처럼 처리.
     * @param id : 직원의 고유 번호
     * @return employeeDto : 변경된 직원의 정보
     */
    public EmployeeDto deleteEmployee(long id) {
        Employee employee = employeeRepository.getReferenceById(id);
        try {
            if(employee.getStatusEnum() != StatusEnum.ACTIVE)
            {
                throw new Exception("해당 id는 활성화 상태가 아닙니다.");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        employee.setStatusEnum(StatusEnum.DELETED);
        Employee deletedEmployee = employeeRepository.save(employee);
        return EmployeeDto.toEmployeeDto(deletedEmployee);
    }
}
