package com.a508.wms.product.domain;

import com.a508.wms.business.domain.Business;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "import")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Import extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(nullable = false)
    private Long warehouseId;

    @Column(nullable = false)
    private Long barcode;

    @Column
    private LocalDateTime expirationDate;

    @Column
    private LocalDateTime date;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int quantity;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @Enumerated(EnumType.STRING)
    private ProductStorageTypeEnum productStorageType;

    public void updateBusiness(Business business) {
        this.business = business;
    }
}
