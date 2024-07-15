package com.a508.wms.domain;

import com.a508.wms.util.Status;
import jakarta.persistence.*;
import java.sql.Timestamp;
import lombok.Getter;

@Entity
@Getter
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_detail_id", nullable = false)
    private ProductDetail productDetail;

    @Column(nullable = false)
    private int productQuantity;

    @Column
    private Timestamp expirationDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

}
