package com.a508.wms.notification.service;

import com.a508.wms.notification.dto.NotificationResponseDto;
import com.a508.wms.notification.repository.NotificationRepository;
import com.a508.wms.product.dto.ImportResponseDto;
import com.a508.wms.product.repository.ExportRepository;
import com.a508.wms.product.repository.ImportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final ImportRepository importRepository;
    private final ExportRepository exportRepository;

    public List<NotificationResponseDto> findAll() {
//        1. 입고내역 불러오고 저장
        List<ImportResponseDto> importResponseDtos;
//        (1) import table에서 입고 내역 해당 사업체 아이디로 찾기
//        (2)  importDto
//        2. 출고내역 불러오기 저장
//        3. 각 리스트 넣어서 리턴
        return null;
    }


}
