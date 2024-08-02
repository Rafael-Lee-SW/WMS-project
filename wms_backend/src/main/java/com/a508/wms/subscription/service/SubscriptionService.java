package com.a508.wms.subscription.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.repository.BusinessRepository;
import com.a508.wms.subscription.domain.Subscription;
import com.a508.wms.subscription.dto.SubscriptionDto;
import com.a508.wms.subscription.mapper.SubscriptionMapper;
import com.a508.wms.subscription.repository.SubscriptionRepository;
import com.a508.wms.util.constant.StatusEnum;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final BusinessRepository businessRepository;


    /**
     * 구독 테이블의 모든 정보를 반환하는 메서드
     *
     * @return List<SubscriptionDto>
     */
    @Transactional(readOnly = true)
    public List<SubscriptionDto> findAll() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        log.info("subscriptions: {}",
            subscriptions.stream().map(SubscriptionMapper::fromSubscription).toList());
        return subscriptions.stream().map(SubscriptionMapper::fromSubscription).toList();
    }

    /**
     * 특정 사업체의 모든 구독 정보를 반환하는 메서드
     *
     * @param id : 사업체 고유 번호
     * @return SubscriptionDto List
     */
    public List<SubscriptionDto> findsByBusinessId(long id) {
        List<Subscription> subscriptions = subscriptionRepository.findByBusinessId(id);
        return subscriptions.stream().map(SubscriptionMapper::fromSubscription).toList();
    }

    /**
     * 특정 사업체의 구독 정보를 추가하는 메서드
     *
     * @param subscriptionDto:추가할 구독 정보
     * @return SubscriptionDto
     */
    @Transactional
    public SubscriptionDto save(SubscriptionDto subscriptionDto) {
        Business business = businessRepository.findById(subscriptionDto.getBusinessId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid business Id:" + subscriptionDto.getBusinessId()));

        Subscription subscription = SubscriptionMapper.fromDto(subscriptionDto);
        subscription.setBusiness(business);
        subscription.setSubscriptionTypeEnum(subscriptionDto.getSubscriptionTypeEnum());

        return SubscriptionMapper.fromSubscription(subscriptionRepository.save(subscription));
    }


    /**
     * 특정 사업체의 구독 정보를 수정하는 메서드
     *
     * @param id : 사업체 고유 번호, subscriptionDto:수정할 구독 정보
     * @return SubscriptionDto
     */
    @Transactional
    public SubscriptionDto update(Long id, SubscriptionDto subscriptionDto) {
        Business business = businessRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid business Id:" + id));

        Subscription subscription = subscriptionRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid Id:" + id));
        Subscription updateSubscription = Subscription.builder()
                .business(business)
                .subscriptionTypeEnum((subscriptionDto.getSubscriptionTypeEnum() == null) ? subscription.getSubscriptionTypeEnum()
                        : subscriptionDto.getSubscriptionTypeEnum())
                .startDate((subscriptionDto.getStartDate() == null) ? subscription.getStartDate()
                        : subscriptionDto.getStartDate())
                .endDate((subscriptionDto.getEndDate() == null) ? subscription.getEndDate()
                        : subscriptionDto.getEndDate())
                .paidTypeEnum((subscriptionDto.getPaidTypeEnum() == null) ? subscription.getPaidTypeEnum()
                        : subscriptionDto.getPaidTypeEnum())
                .statusEnum((subscriptionDto.getStatusEnum() == null) ? subscription.getStatusEnum()
                        : subscriptionDto.getStatusEnum())
                .build();
        return SubscriptionMapper.fromSubscription(subscriptionRepository.save(updateSubscription));
    }

    /**
     * 특정 사업체의 구독 정보를 삭제하는 메서드
     *
     * @param id : 구독 고유 번호
     */
    @Transactional
    public void delete(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid subscription Id:" + id));
        subscription.setStatusEnum(StatusEnum.DELETED);
        subscriptionRepository.save(subscription);
    }
}
