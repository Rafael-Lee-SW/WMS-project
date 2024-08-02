package com.a508.wms.product.domain;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@ToString
@Table(name = "product")
public class Product extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "product_detail_id", nullable = false)
    private ProductDetail productDetail;
    @ManyToOne
    @JoinColumn(name = "floor_id", nullable = false)
    private Floor floor;
    @Column(nullable = false)
    private int quantity;
    @Column
    private LocalDateTime expirationDate;
    @Column(nullable = true, length = 255)
    private String comment;
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @Builder
    public Product(ProductDetail productDetail, Floor floor, int quantity,
                   LocalDateTime expirationDate,
                   String comment) {
        this.productDetail = productDetail;
        this.floor = floor;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
        this.comment = comment;
    }

    public void updateFloor(Floor floor) {
        this.floor = floor;
    }

    // 연관관계 편의 메서드
    public void setProductDetail(ProductDetail productDetail) {
        this.productDetail = productDetail;
        productDetail.getProducts().add(this);
    }

    //데이터의 일괄 수정
    public void updateData(int quantity, LocalDateTime expirationDate, String comment) {
        this.quantity = quantity;
        this.expirationDate = expirationDate;
        this.comment = comment;
    }

    //삭제 상태 변경
    public void updateStatus(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }
}
