package com.a508.wms.controller;

import com.a508.wms.dto.LocationDto;
import com.a508.wms.service.LocationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/locations")
public class LocationController {

    private final LocationService locationService;

    /**
     * @param warehouseId -> 창고 아이디 (필수 x)
     * @return warehouseId값 없으면 전체 조회, 있으면 특정 창고가 보유한 로케이션들 조회
     */
    @GetMapping
    public List<LocationDto> getLocations(@RequestParam(required = false) Long warehouseId) {
       log.info("getLocations");
        if (warehouseId != null) {
            return locationService.findByWarehouseId(warehouseId);
        } else {
            return locationService.findAll();
        }
    }

    /**
     * 특정 로케이션 조회
     * @param id -> 로케이션 아이디
     * @return location이 있으면 locationDto, 없으면 null
     */
    @GetMapping("/{id}")
    public LocationDto getLocationById(@PathVariable Long id){
        log.info("getLocationsByWarehouseId");
        return locationService.findById(id);
    }

    /**
     * 01 -10 이면 로케이션 10번 등록?
     * @param locationDto
     */
    @PostMapping
    public void registerLocation(@RequestBody LocationDto locationDto){
        log.info("registerLocation");
        locationService.save(locationDto);
    }
}
