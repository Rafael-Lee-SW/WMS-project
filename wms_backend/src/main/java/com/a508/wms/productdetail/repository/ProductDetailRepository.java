package com.a508.wms.productdetail.repository;

import com.a508.wms.productdetail.domain.ProductDetail;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {

    public List<ProductDetail> findByBusinessId(Long BusinessId);

    public Optional<ProductDetail> findByBusinessIdAndBarcode(Long BusinessId, Long Barcode);
}