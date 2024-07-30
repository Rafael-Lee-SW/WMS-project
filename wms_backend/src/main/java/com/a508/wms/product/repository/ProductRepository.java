package com.a508.wms.product.repository;

import com.a508.wms.product.domain.Product;
import com.a508.wms.product.dto.ProductPickingLocationDto;
import com.a508.wms.product.dto.ProductQuantityDto;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByProductDetailId(Long id);

    @Query("SELECT p FROM Product p " +
        "JOIN p.productDetail pd " +
        "JOIN pd.business b " +
        "WHERE b.id = :businessID")
    List<Product> findByBusinessId(@Param("businessID") Long businessID);

    @Query("SELECT p FROM Product p " +
        "JOIN p.floor f " +
        "JOIN f.location l " +
        "JOIN l.warehouse w " +
        "WHERE w.id = :warehouseID")
    List<Product> findByWarehouseId(@Param("warehouseID") Long warehouseID);

    @Query("SELECT p FROM Product p " +
        "JOIN p.floor f " +
        "JOIN f.location l " +
        "WHERE l.id = :locationID")
    List<Product> findByLocationId(@Param("locationID") Long locationID);


    @Query(value = "SELECT pd.barcode, " +
        "SUM(CASE WHEN pl.export_type_enum IN ('STORE', 'DISPLAY') THEN p.product_quantity ELSE 0 END) AS possibleQuantity, "
        +
        "SUM(CASE WHEN pl.export_type_enum = 'KEEP' THEN p.product_quantity ELSE 0 END) AS movableQuantity "
        +
        "FROM product p " +
        "JOIN product_detail pd ON p.product_detail_id = pd.id " +
        "JOIN business b ON pd.business_id = b.id " +
        "WHERE pd.barcode = :barcode AND b.id = :businessId " +
        "GROUP BY pd.barcode", nativeQuery = true)
    ProductQuantityDto findQuantityByBarcodeAndBusinessId(@Param("barcode") Long barcode,
        @Param("businessId") Long businessId);

    @Query(value =
        "SELECT w.name AS warehouseName, l.name AS locationName, f.floor_level AS floorLevel, p.id AS productId, "
            +
            "pd.name AS productName, p.product_quantity AS productQuantity " +
            "FROM product p " +
            "JOIN product_detail pd ON p.product_detail_id = pd.id " +
            "JOIN floor f ON pl.floor_id = f.id " +
            "JOIN location l ON f.location_id = l.id " +
            "JOIN warehouse w ON l.warehouse_id = w.id " +
            "WHERE pd.barcode = :barcode AND pd.business_id = :businessId " +
            "ORDER BY w.priority, " +
            "CAST(SUBSTRING_INDEX(l.name, '-', 1) AS UNSIGNED), " +
            "CAST(SUBSTRING_INDEX(l.name, '-', -1) AS UNSIGNED)",
        nativeQuery = true)
    List<ProductPickingLocationDto> findPickingLocation(@Param("barcode") Long barcode,
        @Param("businessId") Long businessId);


    Optional<Product> findByIdAndExpirationDate(Long id, LocalDateTime expirationDate);
}
// 창고명, 로케이션 명, 층 수, productLocationId
// warehouse,location,floor,productLocation,productDetail,product