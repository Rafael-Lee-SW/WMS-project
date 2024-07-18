package com.a508.wms.controller;


import com.a508.wms.controller.response.BaseSuccessResponse;
import com.a508.wms.dto.ProductRequest;
import com.a508.wms.dto.ProductResponse;
import com.a508.wms.service.ProductService;
import java.util.List;
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
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * (서비스 전체/사업자 별/창고 별/상품 정보별)로의 상품들을 반환하는 기능
     * @param businessId 사업자 id
     * @param warehouseId 창고 id
     * @param productDetailId 상품정보 id
     * @return
     */
    @GetMapping
    public BaseSuccessResponse<List<ProductResponse>> findProducts(
        @RequestParam(required = false) Long businessId,
        @RequestParam(required = false) Long warehouseId,
        @RequestParam(required = false) Long productDetailId) {
        if (businessId != null) {
            log.info("findProducts businessId: {}", businessId);
            return new BaseSuccessResponse<>(productService.findByBusinessId(businessId));
        } else if(warehouseId != null){
            log.info("findProducts warehouseId: {}", warehouseId);
            return new BaseSuccessResponse<>(productService.findByWarehouseId(warehouseId));
        }
        else if(productDetailId != null){
            log.info("findProducts productDetailId: {}", productDetailId);
            return new BaseSuccessResponse<>(productService.findByProductDetailId(productDetailId));
        }
        else {
            log.info("findProducts");
            return new BaseSuccessResponse<>(productService.findAll());
        }
    }

    /**
     * 특정 상품을 조회하는 기능
     * @param id 상품 id
     * @return
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<ProductResponse> findProduct(@PathVariable Long id){
        log.info("find product by id: {}", id);
        return new BaseSuccessResponse<>(productService.findById(id));
    }

    /**
     * 상품을 등록하는 기능
     * @param productRequest: Product 데이터
     */
    @PostMapping
    public BaseSuccessResponse<Void> registProduct(@RequestBody ProductRequest productRequest){
        log.info("regist product");
        productService.save(productRequest);

        return new BaseSuccessResponse<>(null);
    }

    /**
     * 상품을 수정하는 기능
     * @param id 상품 id
     * @param productRequest 수정할 상품 정보
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<Void> updateProduct(@PathVariable Long id, @RequestBody ProductRequest productRequest){
        log.info("update product");
        productService.update(id,productRequest);

        return new BaseSuccessResponse<>(null);
    }


    /**
     * 상품을 삭제하는 기능 -> 상품의 상태값을 삭제로 변경
     * @param id: 상품의 id
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> deleteProduct(@PathVariable Long id){
        log.info("delete Product");
        productService.delete(id);

        return new BaseSuccessResponse<>(null);
    }
}
