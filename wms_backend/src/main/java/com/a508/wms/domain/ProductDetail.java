package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "product_detail")
public class ProductDetail extends BaseTimeEntity {

    @Builder
    public ProductDetail(Business business, ProductStorageType productStorageType, Long barcode,
        String name, Long size, Long unit, int originalPrice, int sellingPrice) {
        this.business = business;
        this.productStorageType = productStorageType;
        this.barcode = barcode;
        this.name = name;
        this.size = size;
        this.unit = unit;
        this.originalPrice = originalPrice;
        this.sellingPrice = sellingPrice;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne
    @JoinColumn(name = "product_storage_type_id", nullable = false)
    private ProductStorageType productStorageType;

    @OneToMany(mappedBy = "productDetail")
    private List<Product> products;

    @Column(nullable = false)
    private Long barcode;

    @Column(nullable = false, length = 255)
    private String name;

    @Column
    private Long size;

    @Column
    private Long unit;

    @Column
    private int originalPrice;

    @Column
    private int sellingPrice;

    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    //연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getProductDetails().add(this);
    }
}
