package com.a508.wms.employee.domain;

import com.a508.wms.business.domain.Business;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.LoginTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
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
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getEmployees().add(this);
    }

    public void setStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }


}
