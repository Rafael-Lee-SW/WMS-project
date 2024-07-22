package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.FacilityTypeEnum;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@Setter
@SQLRestriction("status_enum = 'Active'")
@Table(name = "warehouse")
public class Warehouse extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "business_id", nullable = false)
    @ManyToOne
    private Business business;

    @OneToMany(mappedBy = "warehouse")
    private List<Location> locations;

    @Column(nullable = false)
    private int size;

    @Column(length = 20)
    private String name;

    @Column(nullable = false)
    private int rowCount;

    @Column(nullable = false)
    private int columnCount;

    @Column(nullable = false, columnDefinition = "integer default 1")
    private int priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityTypeEnum facilityType;

    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 연관관계 편의를 위한 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getWarehouses().add(this);
    }

}
