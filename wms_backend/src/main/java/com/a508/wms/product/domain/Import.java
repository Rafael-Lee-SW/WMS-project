package com.a508.wms.product.domain;

import com.a508.wms.business.domain.Business;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int productQuantity;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    public void updateBusiness(Business business) {
        this.business = business;
    }
}
