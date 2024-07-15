package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.PaidType;
import com.a508.wms.util.ProductStorageTypeEnum;
import com.a508.wms.util.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;

@Entity
public class ProductStorageType extends BaseTimeEntity {

    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    private ProductStorageTypeEnum name;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
}
