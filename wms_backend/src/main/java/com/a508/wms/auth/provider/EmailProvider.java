package com.a508.wms.auth.provider;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailProvider {

    private final JavaMailSender javaMailSender;

    private final String SUBJECT = "[Web WMS] 인증 메일입니다.";

    public boolean sendCertificationMail(String email,String CertificationNumber){
        try{

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message,true);
            String htmlContent = getCertificationMessage(CertificationNumber);

            messageHelper.setTo(email);
            messageHelper.setSubject(SUBJECT);
            messageHelper.setText(htmlContent, true);
            javaMailSender.send(message);

        }catch (Exception e){
            e.printStackTrace();
            return false;

        }
        return true;

    }
    private String getCertificationMessage (String CertificationNumber){
       String certificationMessage = "";
       certificationMessage += "<h1 style = 'text-align: center;'>[Web WMS] 인증 메일입니다. </h1>";
       certificationMessage +=
           "<h3 style = 'text-align: center;'>"
               + "인증 코드 : <strong style='font-size:32px; letter-spaching:8px;'>"
               + CertificationNumber+"</strong></h3>";
               return certificationMessage;


    }
}
