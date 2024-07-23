package com.a508.wms.service;

import com.a508.wms.domain.Floor;
import com.a508.wms.domain.Product;
import com.a508.wms.domain.ProductDetail;
import com.a508.wms.domain.ProductLocation;
import com.a508.wms.dto.ProductDetailResponseDto;
import com.a508.wms.dto.ProductExportRequestDto;
import com.a508.wms.dto.ProductExportResponseDto;
import com.a508.wms.dto.ProductImportDto;
import com.a508.wms.dto.ProductPickingDto;
import com.a508.wms.dto.ProductPickingLocationDto;
import com.a508.wms.dto.ProductQuantityDto;
import com.a508.wms.dto.ProductRequestDto;
import com.a508.wms.dto.ProductResponseDto;
import com.a508.wms.repository.FloorRepository;
import com.a508.wms.repository.ProductDetailRepository;
import com.a508.wms.repository.ProductLocationRepository;
import com.a508.wms.repository.ProductRepository;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.util.mapper.ProductMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
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

    /**
     * 물품들의 출고 판단 및 처리를 하는 기능
     *
     * @param requests
     * @return
     */
    @Transactional
    public List<ProductExportResponseDto> exportProducts(List<ProductExportRequestDto> requests) {
        //재고 확인
        productQuantityCheck(requests);

        //경로 처리 및 수량 반영

        //송장번호별로 데이터를 묶음.
        Map<Long, List<ProductExportRequestDto>> exports = requests.stream()
            .collect(Collectors.groupingBy((ProductExportRequestDto::getTrackingNumber)));

        //송장별로 처리
        List<ProductExportResponseDto> result = exports.entrySet().stream()
            .map(entry -> {
                Map<String, List<ProductPickingDto>> path = calculatePath(entry.getValue());
                return ProductExportResponseDto.builder()
                    .trackingNumber(entry.getKey())
                    .path(path)
                    .build();
            }).toList();

        return result;
    }

    /**
     * 각 송장별 출고 처리를 진행하여 결과 경로를 반환하는 기능
     *
     * @param invoice : 한 송장의 출고 상품 내역 정보
     * @return
     */
    private Map<String, List<ProductPickingDto>> calculatePath(
        List<ProductExportRequestDto> invoice) {
        Map<String, List<ProductPickingDto>> path = new HashMap<>();
        for (ProductExportRequestDto exportProduct : invoice) {
            //목적 상품에 해당하는 모든 로케이션 data
            List<ProductPickingLocationDto> candidates = productRepository.findPickingLocation(
                exportProduct.getBarcode(), exportProduct.getBusinessId());

            //남은양
            int remains = exportProduct.getQuantity();

            for (ProductPickingLocationDto candidate : candidates) {
                if (candidate.getProductQuantity() == 0) {
                    continue;
                }

                if (candidate.getProductQuantity() >= remains) {
                    //candidate의 값을 remain 뺀 값으로 만들기.
                    updateProductQuantity(candidate.getProductLocationId(),
                        candidate.getProductQuantity() - remains);
                    //path에 추가
                    List<ProductPickingDto> pickings = path.getOrDefault(
                        candidate.getWarehouseName(), new ArrayList<>());

                    pickings.add(ProductPickingDto.builder()
                        .locationName(candidate.getLocationName())
                        .floorLevel(candidate.getFloorLevel())
                        .productName(candidate.getProductName())
                        .amount(candidate.getProductQuantity() - remains)
                        .build());
                    break;
                }

                remains -= candidate.getProductQuantity();

                //candidate의 값을 0으로 만들기.
                updateProductQuantity(candidate.getProductLocationId(), 0);

                //path에 추가
                List<ProductPickingDto> pickings = path.getOrDefault(
                    candidate.getWarehouseName(), new ArrayList<>());

                pickings.add(ProductPickingDto.builder()
                    .locationName(candidate.getLocationName())
                    .floorLevel(candidate.getFloorLevel())
                    .productName(candidate.getProductName())
                    .amount(0)
                    .build());
            }
        }

        return path;
    }

    /**
     * 출고되는 물품의 수량을 변경하는 로직
     *
     * @param productLocationId
     * @param quantity
     */

    private void updateProductQuantity(Long productLocationId, int quantity) {
        ProductLocation productLocation = productLocationRepository.findById(productLocationId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid productLocation Id"));

        Product product = productRepository.findById(productLocation.getProduct().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid productLocation Id"));

        productLocation.updateProductQuantity(quantity);
        product.updateData(quantity, product.getExpirationDate(), product.getComment());

        productLocationRepository.save(productLocation);
        productRepository.save(product);
    }

    /**
     * 현제 출고 명령이 재고상 가능한 상태인지 판단해주는 기능,예외처리 안되면 출고 가능
     *
     * @param requests
     */
    private void productQuantityCheck(List<ProductExportRequestDto> requests) {
        Long businessId = requests.get(0).getBusinessId();
        //각 물품별 총합
        Map<Long, Integer> productTotalCount = requests.stream().collect(
            Collectors.groupingBy((ProductExportRequestDto::getBarcode),
                Collectors.summingInt(ProductExportRequestDto::getQuantity)));

        //물품별 총 재고에 따른 타입 분류 (나중에 Integer를 Enum으로 바꿔도 좋을듯)
        Map<Long, Integer> productQuantityResult = productTotalCount.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey,
                entry -> calculateProductQuantity(entry.getKey(), entry.getValue(), businessId)));

        //불가능 하나라도 있으면 에러 반환
        if (containsImpossibleExportProduct(productQuantityResult)) {
            throw new IllegalArgumentException("수량 부족");
        }

        //재고 이동해야 하는 물품들 확인
        List<Long> movingProductBarcodes = new ArrayList<>();

        productQuantityResult.entrySet().stream()
            .filter(entry -> entry.getValue() == 1)
            .forEach(entry -> movingProductBarcodes.add(entry.getKey()));

        if (!movingProductBarcodes.isEmpty()) {
            throw new IllegalArgumentException(
                "해당 물품들의 이동이 필요합니다." + movingProductBarcodes.toString());
        }
    }

    /**
     * 전체 재고량이 부족하여 출고가 불가능한 경우가 있는지 확인하는 기능.
     *
     * @param productQuantityResult
     * @return
     */
    private boolean containsImpossibleExportProduct(Map<Long, Integer> productQuantityResult) {
        return productQuantityResult.entrySet().stream()
            .anyMatch(entry -> entry.getValue() == 2);
    }

    /**
     * 각 물품별 재고에 따른 출고 가능 여부를 확인하여 매핑해주는 기능.
     *
     * @param barcode
     * @param quantity
     * @param businessId
     * @return
     */
    private Integer calculateProductQuantity(Long barcode, Integer quantity, Long businessId) {
        //매장+전시의 총합과 보관의 총합이 들어있는 게산 결과 반환.
        ProductQuantityDto productQuantityDto = productRepository.findQuantityByBarcodeAndBusinessId(
            barcode, businessId);

        if (productQuantityDto.getPossibleQuantity() >= quantity) {
            return 0; //추가 명령 처리 x
        }

        if (productQuantityDto.getPossibleQuantity() +
            productQuantityDto.getMovableQuantity() >= quantity) {
            return 1; //보충 처리
        }

        return 2; //처리 불가.
    }
}
