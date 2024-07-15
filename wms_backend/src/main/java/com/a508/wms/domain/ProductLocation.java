package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.ExportType;
import com.a508.wms.util.PaidType;
import com.a508.wms.util.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ProductLocation extends BaseTimeEntity {

    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name="floor_id")
    private Floor floor;

    @Column
    private int product_quantity;

    @Enumerated(EnumType.STRING)
    private ExportType exportType;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
}
