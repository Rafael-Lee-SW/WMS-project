package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.dto.EmployeeDto;
import com.a508.wms.util.LoginTypeEnum;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
@Getter
@Table(name = "employee")
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class Employee extends BaseTimeEntity {

    private static final Logger log = LoggerFactory.getLogger(Employee.class);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LoginTypeEnum loginTypeEnum;

    @Column(nullable = false, length = 100)
    private String loginId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getEmployees().add(this);
    }

    public void setStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    /**
     * EmployeeDto 객체를 받아서 변경할 정보는 입력하고 기존 정보는 유지하여 Employee 객체로 변경해주는 메서드
     *
     * @param employeeDto
     * @return Employee
     */
    public Employee toEmployee(EmployeeDto employeeDto) {
        return Employee.builder()
                .id(this.id)
                .business(this.business)
                .name(employeeDto.getName() == null ? this.name : employeeDto.getName())
                .loginTypeEnum(employeeDto.getLoginType() == null ? this.loginTypeEnum : employeeDto.getLoginType())
                .loginId(employeeDto.getLoginId() == null ? this.loginId : employeeDto.getLoginId())
                .statusEnum(employeeDto.getStatus() == null ? this.statusEnum : employeeDto.getStatus())
                .build();
    }
}
