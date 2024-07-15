package com.a508.wms.domain;

import com.a508.wms.util.Status;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(nullable = false)
    private int loginType;

    @Column(nullable = false, length = 100)
    private String loginId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    //연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getEmployees().add(this);
    }
}