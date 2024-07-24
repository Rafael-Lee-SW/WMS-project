package com.a508.wms.employee.mapper;

import com.a508.wms.employee.domain.Employee;
import com.a508.wms.employee.dto.EmployeeDto;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {
    /**
     * EmployeeDto 객체를 받아서 변경할 정보는 입력하고 기존 정보는 유지하여 Employee 객체로 변경해주는 메서드
     * business 제외. 직접 설정하기
     *
     * @param employeeDto
     * @return Employee
     */
    public static Employee fromDto(EmployeeDto employeeDto) {
        return Employee.builder()
                .id(employeeDto.getId())
                .name(employeeDto.getName())
                .loginTypeEnum(employeeDto.getLoginTypeEnum())
                .loginId(employeeDto.getLoginId())
                .statusEnum(employeeDto.getStatusEnum())
                .build();
    }
    /**
     * Employee 객체를 받아서 EmployeeDto 객체로 변환해주는 메서드
     *
     * @param employee
     * @return EmployeeDto
     */
    public static EmployeeDto fromEmployee(Employee employee) {
        return EmployeeDto.builder()
                .id(employee.getId())
                .businessId(employee.getBusiness().getId())
                .name(employee.getName())
                .loginTypeEnum(employee.getLoginTypeEnum())
                .loginId(employee.getLoginId())
                .statusEnum(employee.getStatusEnum())
                .build();
    }

}
