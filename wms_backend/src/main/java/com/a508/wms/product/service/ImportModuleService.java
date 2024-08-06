package com.a508.wms.product.service;

import com.a508.wms.business.repository.BusinessRepository;
import com.a508.wms.product.domain.Import;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.dto.ImportResponseDto;
import com.a508.wms.product.dto.ProductData;
import com.a508.wms.product.dto.ProductImportResponseDto;
import com.a508.wms.product.exception.ProductInvalidRequestException;
import com.a508.wms.product.mapper.ImportMapper;
import com.a508.wms.product.repository.ImportRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportModuleService {

    private final ImportRepository importRepository;
    private final BusinessRepository businessRepository;

    /**
     * 입고 내역을 저장하는 기능
     *
     * @param request
     * @param product
     */
    public void save(ProductData request, Product product) {
        Import importEntity = ImportMapper.fromProduct(product, request.getExpirationDate());
        importRepository.save(importEntity);
    }


    public ProductImportResponseDto findAllByBusinessIdAndDate(Long businessId, LocalDate date) {
        List<Import> importList = importRepository.findAllByBusinessIdAndDate(businessId, date);
        List<ImportResponseDto> dataList = new ArrayList<>();
        for (Import imp : importList) {
            ImportResponseDto importResponseDto = ImportResponseDto.builder()
                .name(imp.getName())
                .quantity(imp.getQuantity())
                .barcode(imp.getBarcode())
                .expirationDate(imp.getExpirationDate())
                .productStorageType(imp.getProductStorageType())
                .build();
            dataList.add(importResponseDto);
        }
        return ProductImportResponseDto.builder()
            .date(date.atStartOfDay())
            .data(dataList)
            .build();
    }

    /**
     * 특정 사업체의 입고내역을 조회하는 기능
     *
     * @param businessId 사업체 id
     * @return
     */

    public List<ImportResponseDto> findAllByBusinessId(Long businessId) {
        if(!businessRepository.existsById(businessId)){
            throw new ProductInvalidRequestException("businessId",businessId);
        }

        List<Import> importList = importRepository.findAllByBusinessId(businessId);
        List<ImportResponseDto> dataList = new ArrayList<>();
        for (Import imp : importList) {
            ImportResponseDto importResponseDto = ImportResponseDto.builder()
                .name(imp.getName())
                .quantity(imp.getQuantity())
                .barcode(imp.getBarcode())
                .expirationDate(imp.getExpirationDate())
                .productStorageType(imp.getProductStorageType())
                .date(imp.getDate())
                .build();
            dataList.add(importResponseDto);
        }
        return dataList;
    }
}
