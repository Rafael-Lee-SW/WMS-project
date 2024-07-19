package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "product")
public class Product extends BaseTimeEntity {

    @Builder
    public Product(ProductDetail productDetail, int productQuantity, LocalDateTime expirationDate,
        String comment) {
        this.productDetail = productDetail;
        this.productQuantity = productQuantity;
        this.expirationDate = expirationDate;
        this.comment = comment;
    }

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
    private LocalDateTime expirationDate;

    @Column(nullable = true,length=255)
    private String comment;

    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 연관관계 편의 메서드
    public void setProductDetail(ProductDetail productDetail) {
        this.productDetail = productDetail;
        productDetail.getProducts().add(this);
    }

    //데이터의 일괄 수정
    public void updateData(int productQuantity, LocalDateTime expirationDate, String comment) {
        this.productQuantity = productQuantity;
        this.expirationDate = expirationDate;
        this.comment = comment;
    }

    //삭제 상태 변경
    public void updateStatus(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }
}
