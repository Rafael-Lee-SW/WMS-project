package com.a508.wms.service;

import com.a508.wms.domain.Product;
import com.a508.wms.domain.ProductDetail;
import com.a508.wms.dto.ProductDetailResponse;
import com.a508.wms.dto.ProductInfos;
import com.a508.wms.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductInfos> findAll(){
        final List<Product> products=productRepository.findAll();
        return products.stream().map(product -> ProductInfos.builder()
            .comment(product.getComment())
            .quantity(product.getProductQuantity())
            .productDetail(getProductDetail(product.getProductDetail()))
            .build())
            .toList();
    }

    public ProductDetailResponse getProductDetail(ProductDetail productDetail){
        return ProductDetailResponse.builder()
            .barcode(productDetail.getBarcode())
            .name(productDetail.getName())
            .size(productDetail.getSize())
            .unit(productDetail.getUnit())
            .originalPrice(productDetail.getOriginalPrice())
            .sellingPrice(productDetail.getSellingPrice())
            .build();
    }
}
