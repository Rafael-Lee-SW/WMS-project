package com.a508.wms.controller;

import com.a508.wms.controller.response.BaseSuccessResponse;
import com.a508.wms.dto.LocationDto;
import com.a508.wms.service.LocationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public BaseSuccessResponse<List<LocationDto>> getLocations(@RequestParam(required = false) Long warehouseId) {
       log.info("getLocations");
        if (warehouseId != null) {
            return new BaseSuccessResponse<>(locationService.findByWarehouseId(warehouseId));
        } else {
            return new BaseSuccessResponse<>(locationService.findAll());
        }
    }

    /**
     * 특정 로케이션 조회
     * @param id -> 로케이션 아이디
     * @return location이 있으면 locationDto, 없으면 null
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<LocationDto> getLocationById(@PathVariable Long id){
        log.info("getLocationsByWarehouseId");
        return new BaseSuccessResponse<>(locationService.findById(id));
//        return locationService.findById(id);
    }

    /**
     * 01 -10 이면 로케이션 10번 등록?
     * @param locationDto
     */
    @PostMapping
    public BaseSuccessResponse<Void> registerLocation(@RequestBody LocationDto locationDto){
        log.info("registerLocation");
        locationService.save(locationDto);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 로케이션 수정. 바꿀 정보를 locationDto에 담아 전달 -> 값 변경
     * @param id -> locationId
     * @param locationDto -> 바꿀 정보(이름과 좌표값들만 가능)
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<Void> updateLocation(@PathVariable Long id, @RequestBody LocationDto locationDto){
        log.info("updateLocation");
        locationService.modify(id, locationDto);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 로케이션 삭제 -> 로케이션의 상태값을 삭제로 변경
     * @param id -> locationId
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> deleteLocation(@PathVariable Long id){
        log.info("deleteLocation");
        locationService.delete(id);
        return new BaseSuccessResponse<>(null);
    }

}
