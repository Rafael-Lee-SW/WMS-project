package com.a508.wms.productdetail.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.service.BusinessModuleService;
import com.a508.wms.product.service.ProductModuleService;
import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.productdetail.dto.ProductDetailRequestDto;
import com.a508.wms.productdetail.dto.ProductDetailResponseDto;
import com.a508.wms.productdetail.mapper.ProductDetailMapper;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductDetailService {

    private final ProductDetailModuleService productDetailModuleService;
    private final BusinessModuleService businessModuleService;
    private final ProductModuleService productModuleService;


    /**
     * 서비스 전체 상품 정보를 반환함.
     *
     * @return
     */
    public List<ProductDetailResponseDto> getProductDetail() {
        List<ProductDetail> result = productDetailModuleService.findAll();

        return result.stream()
            .map(productDetail -> {
                ProductDetailResponseDto productDetailResponseDto = ProductDetailMapper.fromProductDetail(
                    productDetail);
                productDetailResponseDto.setBusinessId(productDetail.getBusiness().getId());
                return productDetailResponseDto;
            })
            .toList();
    }


    /**
     * 사업체에 해당하는 상품정보 반환
     *
     * @param businessId: 사업체 ID
     * @return
     */

    public List<ProductDetailResponseDto> getProductDetailByBusinessId(Long businessId) {
        List<ProductDetail> result = productDetailModuleService.findByBusinessId(businessId);

        return result.stream()
            .map(productDetail -> {
                ProductDetailResponseDto productDetailResponseDto = ProductDetailMapper.fromProductDetail(
                    productDetail);
                productDetailResponseDto.setBusinessId(businessId);
                return productDetailResponseDto;
            })
            .toList();
    }

    /**
     * 해당하는 사업체와 저장 타입을 가져와서 이를 통해 상품정보를 저장하는 기능
     *
     * @param request 상품 정보
     */
    public ProductDetailResponseDto save(ProductDetailRequestDto request) {
        log.info("product detail request: {}", request);
        Business business = businessModuleService.findById(request.getBusinessId());

        ProductDetail productDetail = new ProductDetail(
            business, request.getProductStorageTypeEnum(), request.getBarcode(),
            request.getName(), request.getSize(), request.getUnit(),
            request.getOriginalPrice(), request.getSellingPrice()
        );

        ProductDetail savedProductDetail = productDetailModuleService.save(productDetail);

        log.info("product Detail ID{}", savedProductDetail.getId());

        return ProductDetailMapper.fromProductDetail(savedProductDetail);
    }

    /**
     * 기존 상품 정보를 불러와서 수정하는 기능, 미입력값에 대해서는 기존 값으로 처리한다
     *
     * @param id      상품 정보 ID
     * @param request 상품 정보 수정 Data
     */
    public void modify(Long id, ProductDetailRequestDto request) {
        log.info("product detail request: {}", request);
        ProductDetail productDetail = productDetailModuleService.findById(id);

        log.info("product detail target: {}", productDetail);

        productDetail.updateData(
            request.getProductStorageTypeEnum(),
            request.getBarcode(),
            request.getName(),
            (request.getSize() == null) ? productDetail.getSize() : request.getSize(),
            (request.getUnit() == null) ? productDetail.getUnit() : request.getUnit(),
            (request.getOriginalPrice() == 0) ? productDetail.getOriginalPrice()
                : request.getOriginalPrice(),
            (request.getSellingPrice() == 0) ? productDetail.getSellingPrice()
                : request.getSellingPrice());

        productDetailModuleService.save(productDetail);
    }

    /**
     * 상품 정보의 상태값을 삭제로 변경, 해당 상품정보에 연관되는 모든 데이터의 상태 또한 삭제로 변경
     *
     * @param id 상품 정보 ID
     */
    @Transactional
    public void delete(Long id) {
        log.info("product detail request: {}", id);
        ProductDetail productDetail = productDetailModuleService.findById(id);

        productDetailModuleService.delete(productDetail);

        productDetail.getProducts().forEach(productModuleService::delete);
    }
}
