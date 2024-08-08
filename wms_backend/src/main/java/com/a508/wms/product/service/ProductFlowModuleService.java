package com.a508.wms.product.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.repository.BusinessRepository;
import com.a508.wms.product.domain.Export;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.domain.ProductFlow;
import com.a508.wms.product.dto.*;
import com.a508.wms.product.exception.ProductInvalidRequestException;
import com.a508.wms.product.mapper.ExportMapper;
import com.a508.wms.product.mapper.ProductFlowMapper;
import com.a508.wms.product.repository.ExportRepository;
import com.a508.wms.product.repository.ProductFlowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductFlowModuleService {

    private final ProductFlowRepository productFlowRepository;
    private final ExportRepository exportRepository;
    private final BusinessRepository businessRepository;

    public void saveExport(ExportResponseDto exportResponseDto, Business business) {

        ProductFlow productFlow = ProductFlowMapper.fromExportProductResponseDto(exportResponseDto,business);
        productFlow.updateBusiness(business);
        productFlowRepository.save(productFlow);
    }
    public void saveImport(ProductData request, Product product) {

        Business business = product.getProductDetail().getBusiness();
        ProductFlow productFlow = ProductFlowMapper.fromImportResponseDto(request,business);
        productFlow.updateBusiness(business);
        productFlowRepository.save(productFlow);
    }
    public void saveMove(ProductMoveResponseDto productMoveResponseDto,
                         Business business) {
        ProductFlow productFlow = ProductFlowMapper.fromProductMoveResponseDto(productMoveResponseDto,
                business);
        productFlow.updateBusiness(business);
        productFlowRepository.save(productFlow);
    }

    public List<ExportResponseDto> findAllByBusinessId(Long businessId) {
        if(!businessRepository.existsById(businessId)){
            throw new ProductInvalidRequestException("businessId",businessId);
        }
        List<ExportResponseDto> exportResponseDtos = new ArrayList<>();
        List<Export> exports = exportRepository.findAllByBusinessId(businessId);
        for (Export export : exports) {
            exportResponseDtos.add(ExportMapper.toExportResponseDto(export));
        }
        return exportResponseDtos;
    }
}
