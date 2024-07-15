package com.a508.wms.domain;

import com.a508.wms.util.Status;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "product_detail")
public class ProductDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne
    @JoinColumn(name = "product_storage_type_id", nullable = false)
    private ProductStorageType productStorageType;

    @Column(nullable = false)
    private Long barcode;

    @Column(nullable = false, length = 255)
    private String name;

    @Column
    private Long size;

    @Column
    private Long unit;

    @Column
    private Integer originalPrice;

    @Column
    private Integer sellingPrice;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    //연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getProductDetails().add(this);
    }
}
