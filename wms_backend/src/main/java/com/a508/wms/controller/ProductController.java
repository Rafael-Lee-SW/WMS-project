package com.a508.wms.controller;


import com.a508.wms.domain.Product;
import com.a508.wms.dto.ProductInfos;
import com.a508.wms.dto.ProductResponse;
import com.a508.wms.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService=productService;
    }

    /**
     * 서비스내의 모든 상품 데이터를 가져오는 기능
     * @return
     * results": [
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
     *         },...
     *  ]
     */
    @GetMapping
    public ResponseEntity<ProductResponse> getProducts() {
        return ResponseEntity.ok(
            ProductResponse.builder()
                .results(productService.findAll())
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
}
