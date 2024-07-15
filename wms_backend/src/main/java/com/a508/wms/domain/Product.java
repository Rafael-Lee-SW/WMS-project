package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.List;

import lombok.Getter;

@Entity
@Getter
@Table(name = "product")
public class Product extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_detail_id", nullable = false)
    private ProductDetail productDetail;

    @OneToMany(mappedBy = "product")
    private List<ProductLocation> productLocations;

    @Column(nullable = false)
    private int productQuantity;

    @Column
    private Timestamp expirationDate;

    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 연관관계 편의 메서드
    public void setProductDetail(ProductDetail productDetail) {
        this.productDetail = productDetail;
        productDetail.getProducts().add(this);
    }
}
