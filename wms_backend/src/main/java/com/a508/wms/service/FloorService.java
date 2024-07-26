package com.a508.wms.service;

import com.a508.wms.domain.Floor;
import com.a508.wms.dto.FloorDto;
import com.a508.wms.repository.FloorRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
@RequiredArgsConstructor
public class FloorService {

    private final FloorRepository floorRepository;

    /**
     * location이 가지고 있는 층 전부 조회
     * @param locationId: 로케이션 iD
     * @return FloorDto List
     */
    public List<FloorDto> getAllByLocationId(Long locationId) {
        List<Floor> floors = floorRepository.findAllByLocationId(locationId);
        return floors.stream()
            .map(FloorDto::fromFloor)
            .collect(Collectors.toList());
    }

    /**
     * 층 단일 조회
     * @param id: 층 id
     * @return FloorDto
     */
    public FloorDto findById(@PathVariable Long id) {
        return FloorDto.fromFloor(floorRepository.findById(id)
            .orElseThrow(()-> new IllegalArgumentException("Invalid Floor Id")));
    }
}