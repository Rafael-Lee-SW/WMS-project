package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.constant.ExportTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_location")
public class ProductLocation extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "floor_id")
    private Floor floor;

    @Column(nullable = false)
    private int product_quantity;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ExportTypeEnum exportTypeEnum = ExportTypeEnum.IMPORT;

    @Builder.Default
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 연관관계 편의 메서드
    public void setProduct(Product product) {
        this.product = product;
        product.getProductLocations().add(this);
    }

    // 연관관계 편의 메서드
    public void setFloor(Floor floor) {
        this.floor = floor;
        floor.getProductLocations().add(this);
    }

    //삭제 상태 변경
    public void updateStatus(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public void updateProductQuantity(int product_quantity) {
        this.product_quantity = product_quantity;
    }
}
