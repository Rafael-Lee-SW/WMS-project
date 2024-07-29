package com.a508.wms.floor.service;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.dto.FloorDto;
import com.a508.wms.floor.mapper.FloorMapper;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
@RequiredArgsConstructor
public class FloorService {

    private final FloorModuleService floorModuleService;

    /**
     * location이 가지고 있는 층 전부 조회
     *
     * @param locationId: 로케이션 iD
     * @return FloorDto List
     */
    public List<FloorDto> getAllByLocationId(Long locationId) {
        List<Floor> floors = floorModuleService.findAllByLocationId(locationId);

        return floors.stream()
            .map(FloorMapper::fromFloor)
            .collect(Collectors.toList());
    }

    /**
     * 층 단일 조회
     *
     * @param id: 층 id
     * @return FloorDto
     */
    public FloorDto findById(@PathVariable Long id) {
        Floor floor = floorModuleService.findById(id);

        return FloorMapper.fromFloor(floor);
    }
}
