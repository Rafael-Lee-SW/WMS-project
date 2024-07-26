package com.a508.wms.repository;

import com.a508.wms.domain.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByProductDetailId(Long id);
    @Query("SELECT p FROM Product p " +
        "JOIN p.productDetail pd " +
        "JOIN pd.business b " +
        "WHERE b.id = :businessID")
    List<Product> findByBusinessId(@Param("businessID")Long businessID);
    @Query("SELECT p FROM Product p " +
        "JOIN p.productLocations pl " +
        "JOIN pl.floor f " +
        "JOIN f.location l " +
        "JOIN l.warehouse w " +
        "WHERE w.id = :warehouseID")
    List<Product> findByWarehouseId(@Param("warehouseID") Long warehouseID);
}
