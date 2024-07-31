package com.a508.wms.notification.controller;

import com.a508.wms.notification.dto.NotificationRequestDto;
import com.a508.wms.notification.service.NotificationService;
import com.a508.wms.util.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public BaseSuccessResponse<?> createNotification(@RequestBody NotificationRequestDto notificationRequestDto) {
//        notificationService.save(notificationRequestDto);
        return new BaseSuccessResponse<>(null);
    }
}
