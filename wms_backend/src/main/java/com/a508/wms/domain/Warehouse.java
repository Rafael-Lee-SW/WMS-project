package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="warehouse")
public class Warehouse extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name="business_id",nullable = false)
    @ManyToOne
    private Business business;

    @OneToMany(mappedBy = "warehouse")
    private List<Location> locations;

    @Column(nullable = false)
    private int size;

    @Column(length=20)
    private String name;

    @Column(nullable = false)
    private int rowCount;

    @Column(nullable = false)
    private int columnCount;

    @Column(nullable = false,columnDefinition = "integer default 1")
    private int priority;

    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 연관관계 편의를 위한 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getWarehouses().add(this);
    }

}
