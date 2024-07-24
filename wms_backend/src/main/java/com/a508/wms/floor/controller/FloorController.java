package com.a508.wms.floor;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
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
        log.info("get all Floors by locationId: {}", locationId);
        return floorService.getAllByLocationId(locationId);
    }

    @GetMapping("/{id}")
    public FloorDto getById(@PathVariable Long id) {
        log.info("get Floor by id: {}", id);
        return floorService.findById(id);
    }
}
