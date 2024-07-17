package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.dto.EmployeeDto;
import com.a508.wms.util.LoginTypeEnum;
import com.a508.wms.util.StatusEnum;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
@Getter
@Table(name = "employee")
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

    public Employee(Builder builder) {
        this.id = builder.id;
        this.business = builder.business;
        this.name = builder.name;
        this.loginTypeEnum = builder.loginTypeEnum;
        this.loginId = builder.loginId;
        this.statusEnum = builder.statusEnum;
    }

    public Employee() {

    }

    //연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getEmployees().add(this);
    }

    /**
     * Builder 클래스 : Dto 생성을 위한 클래스
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Builder {
        private Long id;
        private Business business;
        private String name;
        private LoginTypeEnum loginTypeEnum;
        private String loginId;
        private StatusEnum statusEnum;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder business(Business business) {
            this.business = business;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder loginTypeEnum(LoginTypeEnum loginTypeEnum) {
            this.loginTypeEnum = loginTypeEnum;
            return this;
        }

        public Builder loginId(String loginId) {
            this.loginId = loginId;
            return this;
        }

        public Builder statusEnum(StatusEnum statusEnum) {
            this.statusEnum = statusEnum;
            return this;
        }

        public Employee build() {
            return new Employee(this);
        }
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
        Builder builder = new Builder();
        builder.id(this.id);
//        Employee 객체에서는 Business 객체와 매핑되고, Dto에서는 BusinessDto로.
//            Builder 객체에는 Employee를 Return해야 하므로, 안에 들어갈 타입은 Business
        builder.business(this.business);

        if (employeeDto.getName() == null || this.name.equals(employeeDto.getName())) {
            builder.name(this.name);
        } else {
            builder.name(employeeDto.getName());
        }

        if (employeeDto.getLoginType() == null || this.loginTypeEnum.equals(employeeDto.getLoginType())) {
            builder.loginTypeEnum(this.loginTypeEnum);
        } else {
            builder.loginTypeEnum(employeeDto.getLoginType());
        }
        if (employeeDto.getLoginId() == null || this.loginId.equals(employeeDto.getLoginId())) {
            builder.loginId(this.loginId);
        } else {
            builder.loginId(employeeDto.getLoginId());
        }

        if (employeeDto.getStatus() == null || this.statusEnum.equals(employeeDto.getStatus())) {
            builder.statusEnum(this.statusEnum);
        } else {
            builder.statusEnum(employeeDto.getStatus());
        }
        return builder.build();
    }
}