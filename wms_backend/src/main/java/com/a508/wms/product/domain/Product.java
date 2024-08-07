package com.a508.wms.product.domain;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.product.dto.ProductUpdateRequestDto;
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
    private Integer quantity;
    @Column
    private LocalDateTime expirationDate;

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
    }

    public void updateFloor(Floor floor) {
        this.floor = floor;
    }

    // 연관관계 편의 메서드
    public void setProductDetail(ProductDetail productDetail) {
        this.productDetail = productDetail;
        productDetail.getProducts().add(this);
    }
    public void setFloor(Floor floor) {
        this.floor = floor;
        floor.getProducts().add(this);
    }
    public void updateData(int quantity) {
        this.quantity = quantity;
    }
    //데이터의 일괄 수정
    public void updateData(ProductUpdateRequestDto productUpdateRequestDto,
                           Floor floor) {
        this.quantity = productUpdateRequestDto.getQuantity();
        setFloor(floor);
        this.expirationDate = productUpdateRequestDto.getExpirationDate();
    }
    public void updateWithProductDetail(ProductUpdateRequestDto productUpdateRequestDto, Floor floor) {
        // 기존 Product 업데이트 로직
        this.quantity = productUpdateRequestDto.getQuantity();
        setFloor(floor);
        this.expirationDate = productUpdateRequestDto.getExpirationDate();

        // 관련된 ProductDetail도 업데이트
        ProductDetail productDetail = getProductDetail();
        productDetail.updateData(
                productDetail.productStorageType, // 필요시 업데이트할 데이터
                (productUpdateRequestDto.getBarcode() == null) ? productDetail.getBarcode()
                : productUpdateRequestDto.getBarcode(),
                (productUpdateRequestDto.getName() == null) ? productDetail.getName()
                        : productUpdateRequestDto.getName(),
                productDetail.getSize(),  // 필요시 업데이트할 데이터
                productDetail.getUnit(),  // 필요시 업데이트할 데이터
                productDetail.getOriginalPrice(),  // 필요시 업데이트할 데이터
                productDetail.getSellingPrice()  // 필요시 업데이트할 데이터
        );
    }
    //삭제 상태 변경
    public void updateStatus(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }


}
