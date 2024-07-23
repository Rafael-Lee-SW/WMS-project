package com.a508.wms.repository;

import com.a508.wms.domain.ProductLocation;
import com.a508.wms.dto.ProductLocationResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductLocationRepository  extends JpaRepository<ProductLocation, Long> {
    @Query("SELECT p FROM ProductLocation p WHERE p.product.id = :productId")
    List<ProductLocation> findByProductId(@Param("productId") long productId);
    @Query("SELECT p FROM ProductLocation p WHERE p.floor.id = :floorId")
    List<ProductLocation> findByFloorId(@Param("floorId") long floorId);
    @Query("SELECT pl FROM ProductLocation pl " +
            "JOIN pl.product p " +
            "ON pl.product.id = p.id " +
            "JOIN p.productDetail pd " +
            "ON pd.id = p.productDetail.id " +
            "WHERE pd.barcode = :barcode ")
    List<ProductLocation> findByBarcode(long barcode);
}
