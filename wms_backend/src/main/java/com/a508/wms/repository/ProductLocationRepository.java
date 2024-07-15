package com.a508.wms.repository;

import com.a508.wms.domain.ProductLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductLocationRepository  extends JpaRepository<ProductLocation, Long> {
}
