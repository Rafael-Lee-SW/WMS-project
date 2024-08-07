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
            "WHERE b.id = :businessId")
      List<Product> findByBusinessId(@Param ("businessId") Long businessId);

    @Query(value = "select SUM(p.quantity) as quantity, p.id as id, l.name as locationName, " +
            " f.floor_level as floorLevel, p.expiration_date as expiration_date, " +
            " l.warehouse_id as warehouseId, pd.product_storage_type as productStorageType, " +
            " pd.barcode as barcode, pd.name as productName, pd.size as size,pd.unit as unit, " +
            " pd.original_price as originalPrice, pd.selling_price as sellingPrice, " +
            " p.created_date, p.updated_date, p.status_enum, p.floor_id, p.product_detail_id " +
            "from product p " +
            "join product_detail pd on pd.id = p.product_detail_id " +
            "join floor f on p.floor_id = f.id " +
            "join location l on f.location_id = l.id " +
            "where pd.business_id = :businessId " +
            "group by floor_id, expiration_date, product_detail_id ", nativeQuery = true)
    List<Product> findAllByBusinessId(@Param("businessId") Long businessId);

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
        "SUM(CASE WHEN f.export_type_enum IN ('STORE', 'DISPLAY') THEN p.quantity ELSE 0 END) AS possibleQuantity, "
        +
        "SUM(CASE WHEN f.export_type_enum = 'KEEP' THEN p.quantity ELSE 0 END) AS movableQuantity "
        +
        "FROM product p " +
        "JOIN product_detail pd ON p.product_detail_id = pd.id " +
        "JOIN business b ON pd.business_id = b.id " +
        "JOIN floor f ON f.id = p.floor_id " +
        "WHERE pd.barcode = :barcode AND b.id = :businessId " +
        "GROUP BY pd.barcode", nativeQuery = true)
    ProductQuantityDto findQuantityByBarcodeAndBusinessId(@Param("barcode") Long barcode,
        @Param("businessId") Long businessId);

    @Query(value =
        "SELECT w.name AS warehouseName, l.name AS locationName, f.floor_level AS floorLevel, p.id AS productId, "
            +
            "pd.name AS productName, p.quantity AS quantity, l.product_storage_type, l.warehouse_id, p.expiration_date "
            +
            "FROM product p " +
            "JOIN product_detail pd ON p.product_detail_id = pd.id " +
            "JOIN floor f ON p.floor_id = f.id " +
            "JOIN location l ON f.location_id = l.id " +
            "JOIN warehouse w ON l.warehouse_id = w.id " +
            "WHERE pd.barcode = :barcode AND pd.business_id = :businessId " +
             "AND p.quantity > 0 " +
            "ORDER BY w.priority, " +
            "CAST(SUBSTRING_INDEX(l.name, '-', 1) AS UNSIGNED), " +
            "CAST(SUBSTRING_INDEX(l.name, '-', -1) AS UNSIGNED)",
        nativeQuery = true)
    List<ProductPickingLocationDto> findPickingLocation(@Param("barcode") Long barcode,
        @Param("businessId") Long businessId);

//    @Query(value =
//            "SELECT w.name AS warehouseName, l.name AS locationName, f.floor_level AS floorLevel, p.id AS productId, "
//                    +
//                    "pd.name AS productName, p.quantity AS quantity, l.product_storage_type, l.warehouse_id, p.expiration_date as expdate "
//                    +
//                    "FROM product p " +
//                    "JOIN product_detail pd ON p.product_detail_id = pd.id " +
//                    "JOIN floor f ON p.floor_id = f.id " +
//                    "JOIN location l ON f.location_id = l.id " +
//                    "JOIN warehouse w ON l.warehouse_id = w.id " +
//                    "WHERE pd.barcode = :barcode AND pd.business_id = :businessId " +
//                    "ORDER BY w.priority, " +
//                    "CAST(SUBSTRING_INDEX(l.name, '-', 1) AS UNSIGNED), " +
//                    "CAST(SUBSTRING_INDEX(l.name, '-', -1) AS UNSIGNED)",
//            nativeQuery = true)
//    List<ProductPickingDto> findAllPicking(@Param("barcode") Long barcode,
//                                           @Param("businessId") Long businessId);
    Optional<Product> findByIdAndExpirationDate(Long id, LocalDateTime expirationDate);
}

/**
 *  @Query(value = "select SUM(p.quantity) as quantity, p.id as id, l.name as locationName, " +
 *             " f.floor_level as floorLevel, p.expiration_date as expiration_date, " +
 *             " l.warehouse_id as warehouseId, pd.product_storage_type as productStorageType, " +
 *             " pd.barcode as barcode, pd.name as productName, pd.size as size,pd.unit as unit, " +
 *             " pd.original_price as originalPrice, pd.selling_price as sellingPrice, " +
 *             " p.created_date, p.updated_date, p.status_enum, p.floor_id, p.product_detail_id " +
 *             "from product p " +
 *             "join product_detail pd on pd.id = p.product_detail_id " +
 *             "join floor f on p.floor_id = f.id " +
 *             "join location l on f.location_id = l.id " +
 *             "where pd.business_id = :businessId " +
 *             "group by floor_id, expiration_date, product_detail_id ", nativeQuery = true)
 */