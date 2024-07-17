package com.a508.wms.service;

import com.a508.wms.domain.Business;
import com.a508.wms.domain.ProductDetail;
import com.a508.wms.domain.ProductStorageType;
import com.a508.wms.dto.ProductDetailRequest;
import com.a508.wms.dto.ProductDetailResponse;
import com.a508.wms.repository.BusinessRepository;
import com.a508.wms.repository.ProductDetailRepository;
import com.a508.wms.repository.ProductStorageTypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ProductDetailService {
    private final ProductDetailRepository productDetailRepository;
    private final BusinessRepository businessRepository;
    private final ProductStorageTypeRepository productStorageTypeRepository;

    public ProductDetailService(ProductDetailRepository productDetailRepository,
        BusinessRepository businessRepository,
        ProductStorageTypeRepository productStorageTypeRepository) {
        this.productDetailRepository = productDetailRepository;
        this.businessRepository = businessRepository;
        this.productStorageTypeRepository = productStorageTypeRepository;
    }


    /**
     * 해당하는 사업체와 저장 타입을 가져와서 이를 통해 상품정보를 저장하는 기능
     * @param request 상품 정보
     */
    public void save(ProductDetailRequest request) {
        log.info("product detail request: {}", request);
        Business business = businessRepository.findById(request.getBusinessId())
            .orElseThrow(()->new IllegalArgumentException("Invalid business Id"));

        ProductStorageType productStorageType=productStorageTypeRepository.findById(request.getProductStorageTypeId())
            .orElseThrow(()->new IllegalArgumentException("Invalid productStorageType Id"));

        ProductDetail productDetail=new ProductDetail(
            business,productStorageType,request.getBarcode(),
            request.getName(),request.getSize(),request.getUnit(),
            request.getOriginalPrice(), request.getSellingPrice()
        );

        log.info(productDetail.toString());

        productDetailRepository.save(productDetail);
    }
}
