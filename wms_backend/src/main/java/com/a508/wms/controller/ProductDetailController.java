package com.a508.wms.controller;

import com.a508.wms.dto.ProductDetailRequest;
import com.a508.wms.service.ProductDetailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/productDetail")
public class ProductDetailController {
    private final ProductDetailService productDetailService;

    public ProductDetailController(ProductDetailService productDetailService) {
        this.productDetailService = productDetailService;
    }

    /**
     * 상품 정보를 등록하는 기능
     * @param request : 상품 정보
     */
    @PostMapping
    public void createProductDetail(@RequestBody ProductDetailRequest request){
        log.info("save product detail");
        productDetailService.save(request);
    }

    /**
     * 상품 정보를 수정하는 기능
     * @param id 상품 정보 ID
     * @param request 상품 정보 수정 Data
     */

    @PutMapping("/{id}")
    public void updateProductDetail(@PathVariable Long id, @RequestBody ProductDetailRequest request){
        log.info("update product detail");
        productDetailService.modify(id,request);
    }
}
