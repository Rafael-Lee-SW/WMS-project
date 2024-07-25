package com.a508.wms.productdetail.service;

import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.productdetail.repository.ProductDetailRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductDetailModuleService {


    private final ProductDetailRepository productDetailRepository;

    public ProductDetail findById(Long productDetailId) {
        return productDetailRepository.findById(productDetailId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid ProductDetail Id"));
    }

    public ProductDetail getReferenceById(Long productDetailId) {
        return productDetailRepository.getReferenceById(productDetailId);
    }


    public Optional<ProductDetail> findByBusinessIdAndBarcode(Long businessId, Long barcode) {
        return productDetailRepository.findByBusinessIdAndBarcode(businessId, barcode);
    }
}
