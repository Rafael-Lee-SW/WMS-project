package com.a508.wms.notification.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.repository.BusinessRepository;
import com.a508.wms.notification.domain.Notification;
import com.a508.wms.notification.dto.NotificationRequestDto;
import com.a508.wms.notification.repository.NotificationRepository;
import com.a508.wms.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final BusinessRepository businessRepository;
    private final ProductRepository productRepository;

    public void save(NotificationRequestDto notificationRequestDto) {
//         알림 테이블에 저장할 정보: businessId, date, readOrNot(default true))

//        1. BusinessId 불러오기
//
        Business business = businessRepository.findById(notificationRequestDto.getBusinessId()).orElse(null);
//        String content = notificationRequestDto.getExports().stream().map(export -> export.getPath()
//        2. 해당 날짜의 출고 정보 불러오기

        Notification notification = Notification.builder()
                .business(business)
                .date(notificationRequestDto.getDate())
                .readOrNot(true)
                .build();
        notificationRepository.save(notification);

    }

    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }

    public Notification findById(long id) {
        return notificationRepository.findById(id).orElse(null);
    }


}
