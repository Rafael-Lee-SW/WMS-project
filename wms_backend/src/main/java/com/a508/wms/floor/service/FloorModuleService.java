package com.a508.wms.floor.service;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.repository.FloorRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FloorModuleService {

    private final FloorRepository floorRepository;

    /**
     * location이 가지고 있는 층 전부 조회
     *
     * @param locationId: 로케이션 iD
     * @return FloorDto List
     */
    public List<Floor> findAllByLocationId(Long locationId) {
        return floorRepository.findAllByLocationId(locationId);
    }

    /**
     * 층 단일 조회
     *
     * @param floorId: 층 id
     * @return FloorDto
     */
    public Floor findById(Long floorId) {
        return floorRepository.findById(floorId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid Floor Id"));
    }

    public Floor findByWarehouseIdAndLevel(Long warehouseId, int floorLevel) {
        return floorRepository.findFloorByWarehouseId(warehouseId, -1);
    }

    public Floor findByLocationIdAndFloorLevel(Long locationId, int floorLevel) {
        return floorRepository.findByLocationIdAndFloorLevel(locationId, floorLevel);
    }

    public Floor save(Floor floor) {
        return floorRepository.save(floor);
    }
    
    public List<Floor> saveAll(List<Floor> floors) {
        return floorRepository.saveAll(floors);
    }

}
