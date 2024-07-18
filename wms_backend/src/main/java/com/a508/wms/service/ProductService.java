package com.a508.wms.service;

import com.a508.wms.domain.Product;
import com.a508.wms.domain.ProductDetail;
import com.a508.wms.domain.ProductLocation;
import com.a508.wms.dto.ProductRequest;
import com.a508.wms.dto.ProductResponse;
import com.a508.wms.repository.ProductDetailRepository;
import com.a508.wms.repository.ProductLocationRepository;
import com.a508.wms.repository.ProductRepository;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    private final ProductLocationRepository productLocationRepository;

    public ProductService(ProductRepository productRepository,
        ProductDetailRepository productDetailRepository,
        ProductLocationRepository productLocationRepository) {
        this.productRepository = productRepository;
        this.productDetailRepository = productDetailRepository;
        this.productLocationRepository = productLocationRepository;
    }


    /**
     * 서비스의 모든 상품을 반환하는 기능
     * @return
     */
    public List<ProductResponse> findAll(){
        final List<Product> products=productRepository.findAll();

        return products.stream()
            .map(ProductResponse::fromProduct)
            .toList();
    }


    /**
     * 특정 상품을 반환하는 기능
     * @param id 상품(Product)의 id
     * @return
     */
    public ProductResponse findById(Long id){
        Product product=productRepository.findById(id).orElseThrow(EntityNotFoundException::new);

        return ProductResponse.fromProduct(product);
    }

    /**
     * 특정 상품정보에 해당하는 상품들을 반환하는 기능
     * @param id 상품정보(ProductDetail) id
     * @return
     */
    public List<ProductResponse> findByProductDetailId(Long id){
        final List<Product> products=productRepository.findByProductDetailId(id);

        return products.stream()
            .map(ProductResponse::fromProduct)
            .toList();
    };

    /**
     * 특정 사업자에 해당하는 상품들을 반환하는 기능
     * @param id 사업자(Business) id
     * @return
     */

    public List<ProductResponse> findByBusinessId(Long id){
        final List<Product> products=productRepository.findByBusinessId(id);

        return products.stream()
            .map(ProductResponse::fromProduct)
            .toList();
    }

    /**
     * 창고 id에 해당하는 상품들을 반환하는 기능
     * @param id 창고(Warehouse)의 id
     * @return
     */
    public List<ProductResponse> findByWarehouseId(Long id){
        final List<Product> products=productRepository.findByWarehouseId(id);

        return products.stream()
            .map(ProductResponse::fromProduct)
            .toList();
    }

    /**
     * ProductDetail값을 통해 Product를 저장하는 기능
     * @param request: Product 데이터
     */
    public void save(ProductRequest request){
        ProductDetail productDetail=productDetailRepository.findById(request.getProductDetailId())
            .orElseThrow(()->new IllegalArgumentException("Invalid ProductDetail Id"));

        Product product=new Product(productDetail,request.getProductQuantity(),
            request.getExpirationDate(), request.getComment());

        productRepository.save(product);
    }

    /**
     * 기존 상품 데이터를 조회하여 수정하는 기능
     * @param id 상품 id
     * @param request 수정할 상품 데이터
     */
    public void update(Long id,ProductRequest request){
        Product product=productRepository.findById(id)
            .orElseThrow(()->new IllegalArgumentException("Invalid Product Id"));

        product.updateData(
            (request.getProductQuantity()==-1)?product.getProductQuantity():request.getProductQuantity(),
            (request.getExpirationDate()==null)?product.getExpirationDate():request.getExpirationDate(),
            (request.getComment()==null)?product.getComment():request.getComment()
        );

        productRepository.save(product);
    }

    /**
     * 상품의 상태값을 삭제로 변경, 해당 상품에 해당하는 모든 상품 로케이션 또한 변경.
     * @param id 상품의 id
     */
    @Transactional
    public void delete(Long id){
        Product product=productRepository.findById(id)
            .orElseThrow(()->new IllegalArgumentException("Invalid Product Id"));

        product.updateStatus(StatusEnum.DELETED);

        productRepository.save(product);

        for(ProductLocation productLocation:product.getProductLocations()){
            productLocation.updateStatus(StatusEnum.DELETED);
            productLocationRepository.save(productLocation);
        }
    }
}
