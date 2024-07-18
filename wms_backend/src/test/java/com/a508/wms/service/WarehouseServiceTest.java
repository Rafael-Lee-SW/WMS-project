package com.a508.wms.service;

import com.a508.wms.domain.Business;
import com.a508.wms.domain.Warehouse;
import com.a508.wms.dto.WarehouseDto;
import com.a508.wms.repository.BusinessRepository;
import com.a508.wms.repository.WarehouseRepository;
import com.a508.wms.util.StatusEnum;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WarehouseServiceTest {

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private BusinessRepository businessRepository;

    @InjectMocks
    private WarehouseService warehouseService;

    private Business business;
    private Warehouse warehouse;
    private WarehouseDto warehouseDto;

    @BeforeEach
    void setUp() {
        business = new Business.Builder()
            .id(1L)
            .email("test@test.com")
            .password("password")
            .name("Test Business")
            .businessNumber("123456789012")
            .statusEnum(StatusEnum.ACTIVE)
            .build();

        warehouse = new Warehouse();
        warehouse.setId(1L);
        warehouse.setBusiness(business);
        warehouse.setSize(100);
        warehouse.setName("Test Warehouse");
        warehouse.setRowCount(10);
        warehouse.setColumnCount(10);
        warehouse.setPriority(1);
        warehouse.setStatusEnum(StatusEnum.ACTIVE);

        warehouseDto = WarehouseDto.builder()
            .id(1L)
            .businessId(1L)
            .size(100)
            .name("Test Warehouse")
            .rowCount(10)
            .columnCount(10)
            .priority(1)
            .build();
    }

    @Test
    void createWarehouse_success() {
        when(businessRepository.findById(1L)).thenReturn(Optional.of(business));
        when(warehouseRepository.save(any(Warehouse.class))).thenReturn(warehouse);

        WarehouseDto result = warehouseService.createWarehouse(warehouseDto);

        assertNotNull(result);
        assertEquals(warehouse.getName(), result.getName());
        verify(warehouseRepository, times(1)).save(any(Warehouse.class));
    }

    @Test
    void getWarehousesByBusinessId_success() {
        when(warehouseRepository.findByBusinessId(1L)).thenReturn(Arrays.asList(warehouse));

        List<WarehouseDto> result = warehouseService.getWarehousesByBusinessId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(warehouse.getName(), result.get(0).getName());
    }

    @Test
    void getWarehouseById_success() {
        when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));

        WarehouseDto result = warehouseService.getWarehouseById(1L);

        assertNotNull(result);
        assertEquals(warehouse.getName(), result.getName());
    }

    @Test
    void getWarehouseByBusinessIdAndWarehouseId_success() {
        when(warehouseRepository.findByBusinessIdAndId(1L, 1L)).thenReturn(Optional.of(warehouse));

        WarehouseDto result = warehouseService.getWarehouseByBusinessIdAndWarehouseId(1L, 1L);

        assertNotNull(result);
        assertEquals(warehouse.getName(), result.getName());
    }

    @Test
    void patchWarehouse_success() {
        when(warehouseRepository.findByBusinessIdAndId(1L, 1L)).thenReturn(Optional.of(warehouse));

        WarehouseDto updatedDto = WarehouseDto.builder()
            .id(1L)
            .businessId(1L)
            .size(200)
            .name("Updated Warehouse")
            .rowCount(14)
            .columnCount(14)
            .priority(2)
            .build();

        WarehouseDto result = warehouseService.patchWarehouse(1L, 1L, updatedDto);

        assertNotNull(result);
        assertEquals(updatedDto.getName(), result.getName());
        assertEquals(14, result.getRowCount()); // 업데이트된 수직 배치 수 확인
        assertEquals(14, result.getColumnCount()); // 업데이트된 수평 배치 수 확인
        verify(warehouseRepository, times(1)).findByBusinessIdAndId(1L, 1L);
        verify(warehouseRepository, times(1)).save(any(Warehouse.class));
    }

    @Test
    void deactivateWarehouse_success() {
        when(warehouseRepository.findByBusinessIdAndId(1L, 1L)).thenReturn(Optional.of(warehouse));

        warehouseService.deactivateWarehouse(1L, 1L);

        assertEquals(StatusEnum.INACTIVE, warehouse.getStatusEnum());
        verify(warehouseRepository, times(1)).findByBusinessIdAndId(1L, 1L);
        verify(warehouseRepository, times(1)).save(any(Warehouse.class));
    }
}
