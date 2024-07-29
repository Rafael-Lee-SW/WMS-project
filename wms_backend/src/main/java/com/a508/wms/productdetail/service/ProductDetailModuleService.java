package com.a508.wms.productdetail.service;

import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.productdetail.repository.ProductDetailRepository;
import com.a508.wms.util.constant.StatusEnum;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductDetailModuleService {


    private final ProductDetailRepository productDetailRepository;

    /**
     * 전체 ProductDetail을 찾는 기능
     *
     * @return
     */
    public List<ProductDetail> findAll() {
        return productDetailRepository.findAll();
    }

    /**
     * id를 통해 ProductDetail을 찾는 기능
     *
     * @param productDetailId
     * @return
     */
    public ProductDetail findById(Long productDetailId) {
        return productDetailRepository.findById(productDetailId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid ProductDetail Id"));
    }

    /**
     * 사업체 id(PK)를 통해 특정 사업체에 해당하는 상품 정보들을 찾는 기능.
     *
     * @param businessId
     * @return
     */
    public List<ProductDetail> findByBusinessId(Long businessId) {
        return productDetailRepository.findByBusinessId(businessId);
    }

    /**
     * 사업체 id(PK)와 barcode를 통해 특정 상품 정보를 찾는 기능.
     *
     * @param businessId
     * @param barcode
     * @return
     */
    public Optional<ProductDetail> findByBusinessIdAndBarcode(Long businessId, Long barcode) {
        return productDetailRepository.findByBusinessIdAndBarcode(businessId, barcode);
    }

    /**
     * 상품 정보를 저장하는 기능
     *
     * @param productDetail
     * @return
     */
    public ProductDetail save(ProductDetail productDetail) {
        return productDetailRepository.save(productDetail);
    }


    /**
     * 상품 정보를 soft delete하는 기능.
     *
     * @param productDetail
     * @return
     */
    public ProductDetail delete(ProductDetail productDetail) {
        productDetail.updateStatus(StatusEnum.DELETED);
        return save(productDetail);
    }
}
