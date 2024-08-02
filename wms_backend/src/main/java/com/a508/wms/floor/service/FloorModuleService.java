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
    private final int defaultFloorLevel = -1;

    /**
     * location이 가지고 있는 층 전부 조회
     *
     * @param locationId: 로케이션 iD
     * @return Floor List
     */
    public List<Floor> findAllByLocationId(Long locationId) {
        return floorRepository.findAllByLocationId(locationId);
    }

    /**
     * 층 단일 조회
     *
     * @param floorId: 층 id
     * @return Floor
     */
    public Floor findById(Long floorId) {
        return floorRepository.findById(floorId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid Floor Id"));
    }

    /**
     * warehouse의 id와 floorLevel을 통해 default floor를 조회 (차후 수정 필요)
     *
     * @param warehouseId:warehouse의 id
     * @param floorLevel:floor의      floorlevel
     * @return 해당 warehouse의 default Floor
     */
    public Floor findByWarehouseIdAndLevel(Long warehouseId, int floorLevel) {
        return floorRepository.findByWarehouseId(warehouseId, floorLevel);
    }

    public Floor findDefaultFloorByWarehouse(Long warehouseId) {
        return findByWarehouseIdAndLevel(warehouseId, defaultFloorLevel);
    }

    /**
     * floor list를 저장
     *
     * @param floors:저장할 floor list
     * @return id가 포함된 저장된 floor list
     */
    public List<Floor> saveAll(List<Floor> floors) {
        return floorRepository.saveAll(floors);
    }

    /**
     * floor를 저장
     *
     * @param floor:저장할 floor
     * @return id가 포함된 저장된 floor
     */
    public Floor save(Floor floor) {
        return floorRepository.save(floor);
    }

}
