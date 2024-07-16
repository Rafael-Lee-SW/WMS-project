package com.a508.wms.controller;


import com.a508.wms.domain.Product;
import com.a508.wms.dto.ProductResponse;
import com.a508.wms.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService=productService;
    }

    @GetMapping
    public ResponseEntity<ProductResponse> getProducts() {
        return ResponseEntity.ok(
            ProductResponse.builder()
                .results(productService.findAll())
                .build()
        );
    }
}
