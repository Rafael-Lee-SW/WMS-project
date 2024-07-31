package com.a508.wms.product.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.product.domain.Import;
import com.a508.wms.product.dto.ProductImportDto;
import com.a508.wms.product.dto.ProductRequestDto;
import com.a508.wms.product.mapper.ImportMapper;
import com.a508.wms.product.repository.ImportRepository;
import com.a508.wms.productdetail.dto.ProductDetailRequestDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportModuleService {
    private final ImportRepository importRepository;

    /**
     * 입고 dto와 business를 받아서 저장
     * @param productImportDto : 입고 정보가 있는 dto
     * @param business : 사업체의 정보가 담긴 객체
     */
    public void save(ProductImportDto productImportDto, Business business) {
        Import importEntity = ImportMapper.fromDto(productImportDto);
        importEntity.updateBusiness(business);
        importRepository.save(importEntity);
    }

    /**
     * parse from json to dto
     * @param jsonData
     * @return
     * @throws Exception
     */
    public List<ProductImportDto> parseJsonToProductImportDtos(String jsonData) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        List<ProductImportDto> productImportDtos = new ArrayList<>();
        JsonNode rootNode = objectMapper.readTree(jsonData);

        Long businessId = rootNode.get("businessId").asLong();
        Long warehouseId = rootNode.get("warehouseId").asLong();
        JsonNode dataArray = rootNode.get("data");

        for (JsonNode dataNode : dataArray) {
            ProductDetailRequestDto productDetailRequestDto = ProductDetailRequestDto.builder()
                    .barcode(dataNode.get("barcode").asLong())
                    .name(dataNode.get("name").asText())
                    .build();

            ProductRequestDto productRequestDto = ProductRequestDto.builder()
                    .productQuantity(dataNode.get("quantity").asInt())
                    .build();

            ProductImportDto productImportDto = ProductImportDto.builder()
                    .businessId(businessId)
                    .warehouseId(warehouseId)
                    .productDetail(productDetailRequestDto)
                    .product(productRequestDto)
                    .build();

            productImportDtos.add(productImportDto);
        }

        return productImportDtos;
    }
}
