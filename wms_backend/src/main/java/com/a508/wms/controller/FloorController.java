package com.a508.wms.controller;

import com.a508.wms.dto.FloorDto;
import com.a508.wms.service.FloorService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/floors")
public class FloorController {

    private final FloorService floorService;

    /**
     * LocationId를 통해 해당 로케이션이 보유한 층 전부 조회
     * @param locationId:로케이션 아이디
     * @return FloorDto List
     */
    @GetMapping
    public List<FloorDto> getAllByLocationId(@RequestParam Long locationId) {
        return floorService.getAllByLocationId(locationId);
    }

    @GetMapping("/{id}")
    public FloorDto getById(@PathVariable Long id) {
        return floorService.getById(id);
    }
}
