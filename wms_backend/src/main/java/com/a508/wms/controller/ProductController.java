package com.a508.wms.controller;


import com.a508.wms.dto.ProductInfos;
import com.a508.wms.dto.ProductRequest;
import com.a508.wms.dto.ProductResponse;
import com.a508.wms.service.ProductService;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
     * 각 인자에 맞게 전체 조회부터 기준별 조회가 구현된 메서드
     * @param businessId: 사업자 id (PK)
     * @param warehouseId: 창고 id (PK)
     * @param productDetailId: 상품 상세 id (PK)
     * @return
     * {
     *     "results": [
     *         {
     *             "quantity": 0,
     *             "expirationDate": null,
     *             "comment": null,
     *             "productDetail": {
     *                 "barcode": 111111111111,
     *                 "name": "상품1",
     *                 "size": 1,
     *                 "unit": 12,
     *                 "originalPrice": 2000,
     *                 "sellingPrice": 20000
     *             }
     *         },
     *         ...
     *     ]
     *}
     */
    @GetMapping
    public ResponseEntity<ProductResponse> getProducts(
        @RequestParam(required = false) Long businessId,
        @RequestParam(required = false) Long warehouseId,
        @RequestParam(required = false) Long productDetailId) {

        List<ProductInfos> productsData=null;

        if (businessId != null) {
            productsData=productService.findByBusinessId(businessId);
        } else if(warehouseId != null){
            productsData=productService.findByWarehouseId(warehouseId);
        }
        else if(productDetailId != null){
            productsData=productService.findByProductDetailId(productDetailId);
        }
        else{
            productsData=productService.findAll();
        }

        return ResponseEntity.ok(
            ProductResponse.builder()
                .results(productsData)
                .build()
        );
    }


    /**
     * 해당 product의 id에 해당하는
     * @param id : product의 id
     * @return
     * {
     *     "quantity": 0,
     *     "expirationDate": null,
     *     "comment": null,
     *     "productDetail": {
     *         "barcode": 111111111111,
     *         "name": "상품1",
     *         "size": 1,
     *         "unit": 12,
     *         "originalPrice": 2000,
     *         "sellingPrice": 20000
     *     }
     * }
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductInfos> getProduct(@PathVariable Long id){
        return ResponseEntity.ok(productService.findById(id));
    }

    /**
     * 상품을 등록하는 기능
     * @param productRequest: Product 데이터
     */

    @PostMapping
    public void registProduct(@RequestBody ProductRequest productRequest){
        productService.save(productRequest);
    }

    /**
     * 상품을 수정하는 기능
     * @param id 상품 id
     * @param productRequest 수정할 상품 정보
     */
    @PutMapping("/{id}")
    public void updateProduct(@PathVariable Long id, @RequestBody ProductRequest productRequest){
        productService.update(id,productRequest);
    }


    /**
     * 상품을 삭제하는 기능 -> 상품의 상태값을 삭제로 변경
     * @param id: 상품의 id
     */
    @PatchMapping("/{id}")
    public void deleteProduct(@PathVariable Long id){
        log.info("delete Product");
        productService.delete(id);
    }
}
