package com.a508.wms.location.domain;

import com.a508.wms.productstoragetype.domain.ProductStorageType;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.floor.domain.Floor;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@SQLRestriction("status_enum = 'Active'")
@Table(name = "location")
public class Location extends BaseTimeEntity {

    public Location(Warehouse warehouse, ProductStorageType productStorageType,
                    int xPosition, int yPosition, int width, int height) {
        this.warehouse = warehouse;
        this.productStorageType = productStorageType;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_storage_type_id", nullable = false)
    private ProductStorageType productStorageType;

    @Column(nullable = false, length = 10)
    private String name = "00-00";

    @Column(nullable = false)
    private int xPosition;

    @Column(nullable = false)
    private int yPosition;

    @Column(nullable = false)
    private int width;

    @Column(nullable = false)
    private int height;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @Setter
    @OneToMany(mappedBy = "location")
    private List<Floor> floors = new ArrayList<>();

    //상태값 변경 메서드 -> 삭제에 사용
    public void updateStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public void updatePosition(int xPosition, int yPosition) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
    }

    public void updateName(String name) {
        this.name = name;
    }

    // 연관관계 편의 메서드
    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
        warehouse.getLocations().add(this);
    }

}