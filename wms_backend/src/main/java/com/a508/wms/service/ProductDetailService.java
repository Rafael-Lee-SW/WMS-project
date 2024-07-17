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

    /**
     * 기존 상품 정보를 불러와서 수정하는 기능, 미입력값에 대해서는 기존 값으로 처리한다
     * @param id 상품 정보 ID
     * @param request 상품 정보 수정 Data
     */
    public void modify(Long id,ProductDetailRequest request) {
        log.info("product detail request: {}", request);
        ProductDetail productDetail=productDetailRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("Invalid productDetail Id"));

        ProductStorageType productStorageType=productStorageTypeRepository.findById(request.getProductStorageTypeId())
            .orElseThrow(()->new IllegalArgumentException("Invalid productStorageType Id"));

        log.info("product detail target: {}", productDetail);

        productDetail.updateData(
            productStorageType,
            request.getBarcode(),
            request.getName(),
            (request.getSize()==null)?productDetail.getSize():request.getSize(),
            (request.getUnit()==null)? productDetail.getUnit() : request.getUnit(),
            (request.getOriginalPrice()==0)? productDetail.getOriginalPrice() : request.getOriginalPrice(),
            (request.getSellingPrice()==0)? productDetail.getSellingPrice() : request.getSellingPrice()
        );

        productDetailRepository.save(productDetail);
    }
}
