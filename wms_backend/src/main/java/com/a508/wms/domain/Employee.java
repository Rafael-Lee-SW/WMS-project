package com.a508.wms.domain;

import com.a508.wms.util.LoginTypeEnum;
import com.a508.wms.util.StatusEnum;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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

    //연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getEmployees().add(this);
    }
}