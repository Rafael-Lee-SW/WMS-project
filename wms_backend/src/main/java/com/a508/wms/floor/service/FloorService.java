package com.a508.wms.floor.service;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.dto.FloorResponseDto;
import com.a508.wms.floor.mapper.FloorMapper;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
@Slf4j
@RequiredArgsConstructor
public class FloorService {

    private final FloorModuleService floorModuleService;

    /**
     * location이 가지고 있는 층 전부 조회
     *
     * @param locationId: 로케이션 iD
     * @return FloorDto List
     */
    public List<FloorResponseDto> findAllByLocationId(Long locationId) {
        log.info("[Service] find all Floors by locationId: {}", locationId);
        List<Floor> floors = floorModuleService.findAllByLocationId(locationId);

        return floors.stream()
            .map(FloorMapper::toFloorResponseDto)
            .collect(Collectors.toList());
    }

    /**
     * 층 단일 조회
     *
     * @param id: 층 id
     * @return FloorDto
     */
    public FloorResponseDto findById(@PathVariable Long id) {
        log.info("[Service] find Floor by id: {}", id);
        Floor floor = floorModuleService.findById(id);

        return FloorMapper.toFloorResponseDto(floor);
    }
}
