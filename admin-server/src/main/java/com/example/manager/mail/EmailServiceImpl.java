/**
 * @author: Chen
 * @date:   Mar 14, 2019
 */
package com.example.manager.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;

/**
 * @author Chen
 * @date   Mar 14, 2019
 * @description mailServiceImpl.java	
 */
@Component
public class EmailServiceImpl implements EmailService {
	protected static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

	@Autowired
    public JavaMailSender emailSender;
	
	@Override
	@Async
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
        	SimpleMailMessage message = new SimpleMailMessage(); 
            message.setTo(to); 
            message.setSubject(subject); 
            message.setText(text);
            emailSender.send(message);
		} catch (Exception ex) {
			logger.error("get EmailTemplate error:{}", JSON.toJSONString(ex));
		}
    }
}
