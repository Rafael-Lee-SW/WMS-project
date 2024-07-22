package com.a508.wms.service;

import com.a508.wms.domain.Floor;
import com.a508.wms.domain.Product;
import com.a508.wms.domain.ProductDetail;
import com.a508.wms.domain.ProductLocation;
import com.a508.wms.dto.ProductDetailResponseDto;
import com.a508.wms.dto.ProductImportDto;
import com.a508.wms.dto.ProductRequestDto;
import com.a508.wms.dto.ProductResponseDto;
import com.a508.wms.repository.FloorRepository;
import com.a508.wms.repository.LocationRepository;
import com.a508.wms.repository.ProductDetailRepository;
import com.a508.wms.repository.ProductLocationRepository;
import com.a508.wms.repository.ProductRepository;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.util.mapper.ProductMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    private final ProductLocationRepository productLocationRepository;
    private final ProductDetailService productDetailService;
    private final LocationRepository locationRepository;
    private final FloorRepository floorRepository;

    /**
     * 서비스의 모든 상품을 반환하는 기능
     *
     * @return
     */
    public List<ProductResponseDto> findAll() {
        final List<Product> products = productRepository.findAll();

        return products.stream()
            .map(ProductMapper::fromProduct)
            .toList();
    }


    /**
     * 특정 상품을 반환하는 기능
     *
     * @param id 상품(Product)의 id
     * @return
     */
    public ProductResponseDto findById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(EntityNotFoundException::new);

        return ProductMapper.fromProduct(product);
    }

    /**
     * 특정 상품정보에 해당하는 상품들을 반환하는 기능
     *
     * @param id 상품정보(ProductDetail) id
     * @return
     */
    public List<ProductResponseDto> findByProductDetailId(Long id) {
        final List<Product> products = productRepository.findByProductDetailId(id);

        return products.stream()
            .map(ProductMapper::fromProduct)
            .toList();
    }

    /**
     * 특정 사업자에 해당하는 상품들을 반환하는 기능
     *
     * @param id 사업자(Business) id
     * @return
     */

    public List<ProductResponseDto> findByBusinessId(Long id) {
        final List<Product> products = productRepository.findByBusinessId(id);

        return products.stream()
            .map(ProductMapper::fromProduct)
            .toList();
    }

    /**
     * 창고 id에 해당하는 상품들을 반환하는 기능
     *
     * @param id 창고(Warehouse)의 id
     * @return
     */
    public List<ProductResponseDto> findByWarehouseId(Long id) {
        final List<Product> products = productRepository.findByWarehouseId(id);

        return products.stream()
            .map(ProductMapper::fromProduct)
            .toList();
    }

    /**
     * ProductDetail값을 통해 Product를 저장하는 기능
     *
     * @param request: Product 데이터
     */
    public void save(ProductRequestDto request) {
        ProductDetail productDetail = productDetailRepository.findById(request.getProductDetailId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid ProductDetail Id"));

        Product product = new Product(productDetail, request.getProductQuantity(),
            request.getExpirationDate(), request.getComment());

        productRepository.save(product);
    }

    /**
     * 기존 상품 데이터를 조회하여 수정하는 기능
     *
     * @param id      상품 id
     * @param request 수정할 상품 데이터
     */
    public void update(Long id, ProductRequestDto request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid Product Id"));

        product.updateData(
            (request.getProductQuantity() == -1) ? product.getProductQuantity()
                : request.getProductQuantity(),
            (request.getExpirationDate() == null) ? product.getExpirationDate()
                : request.getExpirationDate(),
            (request.getComment() == null) ? product.getComment() : request.getComment()
        );

        productRepository.save(product);
    }

    /**
     * 상품의 상태값을 삭제로 변경, 해당 상품에 해당하는 모든 상품 로케이션 또한 변경.
     *
     * @param id 상품의 id
     */
    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid Product Id"));

        product.updateStatus(StatusEnum.DELETED);

        productRepository.save(product);

        product.getProductLocations()
            .forEach(productLocation -> productLocation.updateStatus(StatusEnum.DELETED));

        productLocationRepository.saveAll(product.getProductLocations());
    }

    /**
     * 상품들의 입고처리를 수행함.
     *
     * @param requests
     */
    @Transactional
    public void importProducts(List<ProductImportDto> requests) {
        log.info("Importing products");
        Long businessId = requests.get(0).getBusinessId();
        //각 사업자별 입고처리된 상품들이 들어갈 default floor
        Floor defaultFloor = floorRepository.findDefaultFloorByBusinessId(businessId);

        log.info("default floor Id: {}", defaultFloor.getId());

        for (ProductImportDto request : requests) {
            importProduct(request, defaultFloor);
            log.info("finish save product");
        }
    }

    /**
     * 한 상품의 입고처리를 수행함
     *
     * @param request
     * @param defaultFloor: 입고 처리 된 상품이 들어가는 default 층
     */
    private void importProduct(ProductImportDto request, Floor defaultFloor) {
        log.info("Importing product");
        Product importProduct = saveProduct(request);

        //Mapping Product
        ProductLocation productLocation = ProductLocation.builder()
            .product(importProduct)
            .floor(defaultFloor)
            .product_quantity(importProduct.getProductQuantity())
            .exportTypeEnum(defaultFloor.getExportTypeEnum())
            .build();

        productLocationRepository.save(productLocation);
    }

    /**
     * 입고로 들어온 상품의 데이터를 DB에 저장한다.
     *
     * @param request
     * @return
     */
    private Product saveProduct(ProductImportDto request) {
        log.info("Saving product: {}", request);
        ProductDetail productDetail = getProductDetail(request);

        log.info("product detail: {}", productDetail);
        Product product = Product.builder()
            .productQuantity(request.getProduct().getProductQuantity())
            .comment(request.getProduct().getComment())
            .expirationDate(request.getProduct().getExpirationDate())
            .productDetail(productDetail)
            .build();

        productRepository.save(product);
        return product;
    }

    /**
     * 저장하려는 상품정보가 현재 DB에 있는지 확인하고 없으면 추가하는 기능
     *
     * @param request
     * @return
     */
    private ProductDetail getProductDetail(ProductImportDto request) {
        Optional<ProductDetail> optionalProductDetail = productDetailRepository.findByBusinessIdAndBarcode(
            request.getBusinessId(), request.getProductDetail().getBarcode());

        if (optionalProductDetail.isPresent()) {
            log.info("Found product detail: {}", optionalProductDetail.get());
            return optionalProductDetail.get();
        }

        log.info("not found product detail");

        request.getProductDetail().setBusinessId(request.getBusinessId());

        //없으면 ProductDetail을 새로 만들어야함.
        ProductDetailResponseDto productDetailResponseDto = productDetailService.save(
            request.getProductDetail());

        log.info("productDetailDto: {}", productDetailResponseDto);
        return productDetailRepository.getReferenceById(productDetailResponseDto.getId());
    }

}
