package com.a508.wms.service;

import com.a508.wms.domain.Business;
import com.a508.wms.domain.Subscription;
import com.a508.wms.domain.SubscriptionType;
import com.a508.wms.dto.SubscriptionDto;
import com.a508.wms.repository.BusinessRepository;
import com.a508.wms.repository.SubscriptionRepository;
import com.a508.wms.repository.SubscriptionTypeRepository;
import com.a508.wms.util.constant.StatusEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionService.class);
    private final SubscriptionRepository subscriptionRepository;
    private final BusinessRepository businessRepository;
    private final SubscriptionTypeRepository subscriptionTypeRepository;

    @Autowired
    public SubscriptionService(SubscriptionRepository subscriptionRepository, BusinessRepository businessRepository, SubscriptionTypeRepository subscriptionTypeRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.businessRepository = businessRepository;
        this.subscriptionTypeRepository = subscriptionTypeRepository;
    }


    /**
     * 구독 테이블의 모든 정보를 반환하는 메서드
     *
     * @return List<SubscriptionDto>
     */
    @Transactional(readOnly = true)
    public List<SubscriptionDto> getSubscriptions() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        log.info("subscriptions: {}", subscriptions.stream().map(SubscriptionDto::fromSubscription).collect(Collectors.toList()));
        return subscriptions.stream().map(SubscriptionDto::fromSubscription).collect(Collectors.toList());
    }

    /**
     * 특정 사업체의 모든 구독 정보를 반환하는 메서드
     *
     * @param id : 사업체 고유 번호
     * @return SubscriptionDto List
     */
    public List<SubscriptionDto> getSubscriptionByBusinessId(long id) {
        List<Subscription> subscriptions = subscriptionRepository.findByBusinessId(id);
        return subscriptions.stream().map(SubscriptionDto::fromSubscription).collect(Collectors.toList());
    }

    /**
     * 특정 사업체의 구독 정보를 추가하는 메서드
     *
     * @param id : 사업체 고유 번호, subscriptionDto:추가할 구독 정보
     * @return SubscriptionDto
     */
    @Transactional
    public SubscriptionDto addSubscription(long id, SubscriptionDto subscriptionDto) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid business Id:" + id));

        SubscriptionType subscriptionType = subscriptionTypeRepository.findById(subscriptionDto.getSubscriptionTypeDto().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid subscription type Id:" + subscriptionDto.getSubscriptionTypeDto().getId()));

        Subscription subscription = SubscriptionDto.toSubscription(subscriptionDto);
        subscription.setBusiness(business);
        subscription.setSubscriptionType(subscriptionType);

        return SubscriptionDto.fromSubscription(subscriptionRepository.save(subscription));
    }


    /**
     * 특정 사업체의 구독 정보를 수정하는 메서드
     *
     * @param id : 사업체 고유 번호, subscriptionDto:수정할 구독 정보
     * @return SubscriptionDto
     */
    @Transactional
    public SubscriptionDto updateSubscription(long id, SubscriptionDto subscriptionDto) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid business Id:" + id));

        SubscriptionType subscriptionType = subscriptionTypeRepository.findById(subscriptionDto.getSubscriptionTypeDto().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid subscription type Id:" + subscriptionDto.getSubscriptionTypeDto().getId()));

        Subscription subscription = SubscriptionDto.toSubscription(subscriptionDto);
        subscription.setBusiness(business);
        subscription.setSubscriptionType(subscriptionType);

        return SubscriptionDto.fromSubscription(subscriptionRepository.save(subscription));
    }

    /**
     * 특정 사업체의 구독 정보를 삭제하는 메서드
     *
     * @param id : 구독 고유 번호
     */
    @Transactional
    public void deleteSubscription(long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid subscription Id:" + id));
        subscription.setStatusEnum(StatusEnum.DELETED);
        subscriptionRepository.save(subscription);
    }
}
