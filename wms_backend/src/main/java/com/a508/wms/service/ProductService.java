package com.a508.wms.service;

import com.a508.wms.domain.Product;
import com.a508.wms.domain.ProductDetail;
import com.a508.wms.dto.ProductDetailResponse;
import com.a508.wms.dto.ProductInfos;
import com.a508.wms.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    /**
     * DB에서 가져온 Product의 데이터를 Stream을 통해 Dto로 전환하여 반환해주는 기능
     * @return List<ProductInfos> Product의 데이터를 가진 DTO들의 List
     */
    public List<ProductInfos> findAll(){
        final List<Product> products=productRepository.findAll();
        return products.stream().map(product -> ProductInfos.builder()
            .comment(product.getComment())
            .quantity(product.getProductQuantity())
            .productDetail(getProductDetail(product.getProductDetail()))
            .build())
            .toList();
    }

    /**
     *
     * @param productDetail : ProductDetail의 데이터를 Dto로 변환해주는 기능
     * @return ProductDetailResponse : ProductDetail의 데이터를 가진 DTO
     */
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

    /**
     * 인자로 들어온 id에 해당하는 Product를 반환하는 기능
     * id에 해당 하는 데이터가 없다면 예외 발생.
     * @param id : Product의 id
     * @return ProductInfos: Product의 데이터를 가진 DTO
     */
    public ProductInfos findById(long id){
        Product product=productRepository.findById(id).orElseThrow(EntityNotFoundException::new);

        return ProductInfos.builder()
            .comment(product.getComment())
            .quantity(product.getProductQuantity())
            .productDetail(getProductDetail(product.getProductDetail()))
            .build();
    }
}
