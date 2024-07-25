package com.a508.wms.auth.provider;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class EmailProviderTest {

    @Autowired
    private EmailProvider emailProvider;

    @Test
    public void testSendCertificationMail() {
        boolean result = emailProvider.sendCertificationMail("kurladbtjr@gmail.com", "123456");
        assertTrue(result, "메일 전송이 실패했습니다.");
    }
}
