package com.a508.wms.location.domain;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
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

    public Location(Warehouse warehouse, ProductStorageTypeEnum productStorageTypeEnum,
                    int xPosition, int yPosition, int width, int height) {
        this.warehouse = warehouse;
        this.productStorageTypeEnum = productStorageTypeEnum;
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

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductStorageTypeEnum productStorageTypeEnum;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String name = "00-00";

    @Column(nullable = false)
    @Builder.Default
    private int xPosition = -1;

    @Column(nullable = false)
    @Builder.Default
    private int yPosition = -1;

    @Column(nullable = false)
    @Builder.Default
    private int width = -1;

    @Column(nullable = false)
    @Builder.Default
    private int height = -1;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @Setter
    @OneToMany(mappedBy = "location")
    @Builder.Default
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