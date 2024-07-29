package com.a508.wms.productdetail.controller;

import com.a508.wms.productdetail.dto.ProductDetailRequestDto;
import com.a508.wms.productdetail.dto.ProductDetailResponseDto;
import com.a508.wms.productdetail.service.ProductDetailService;
import com.a508.wms.util.BaseSuccessResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/productDetails")
@RequiredArgsConstructor
public class ProductDetailController {

    private final ProductDetailService productDetailService;

    /**
     * (서비스 전체 / 사업체 별) 상품 정보 조회
     *
     * @param businessId: 사업체 id
     * @return
     */
    @GetMapping
    public BaseSuccessResponse<List<ProductDetailResponseDto>> getProductDetail(
        @RequestParam(required = false) Long businessId) {
        if (businessId != null) {
            log.info("get ProductDetail businessId:{}", businessId);
            return new BaseSuccessResponse<>(
                productDetailService.getProductDetailByBusinessId(businessId));
        } else {
            log.info("get productDetail");
            return new BaseSuccessResponse<>(productDetailService.getProductDetail());
        }
    }

    /**
     * 상품 정보를 등록하는 기능
     *
     * @param request : 상품 정보
     */
    @PostMapping
    public BaseSuccessResponse<Void> createProductDetail(
        @RequestBody ProductDetailRequestDto request) {
        log.info("create ProductDetail request:{}", request);
        productDetailService.save(request);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 상품 정보를 수정하는 기능
     *
     * @param id      상품 정보 ID
     * @param request 상품 정보 수정 Data
     */

    @PutMapping("/{id}")
    public BaseSuccessResponse<Void> updateProductDetail(@PathVariable Long id,
        @RequestBody ProductDetailRequestDto request) {
        log.info("update ProductDetail by id:{} request:{}", id, request);
        productDetailService.modify(id, request);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 상품 정보의 상태값을 삭제로 변경, 해당 상품정보에 연관되는 모든 데이터의 상태 또한 삭제로 변경
     *
     * @param id 상품 정보 ID
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> deleteProductDetail(@PathVariable Long id) {
        log.info("delete ProductDetail by id:{}", id);
        productDetailService.delete(id);

        return new BaseSuccessResponse<>(null);
    }

}
