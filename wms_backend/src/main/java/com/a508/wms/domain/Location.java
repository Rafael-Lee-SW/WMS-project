package com.a508.wms.domain;

import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;
import java.util.List;
import lombok.Getter;

@Entity
@Getter
@Table(name = "location")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne
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

    @OneToMany(mappedBy = "location")
    private List<Floor> floors;

    // 연관관계 편의 메서드
    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
        warehouse.getLocations().add(this);
    }
}