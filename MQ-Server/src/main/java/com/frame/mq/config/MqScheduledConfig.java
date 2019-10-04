package com.frame.mq.config;
///**
// * @author: Chen
// * @date:   Sep 6, 2019
// */
//package com.example.kafka.config;
//import java.util.UUID;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.scheduling.annotation.EnableScheduling;
//import org.springframework.scheduling.annotation.Scheduled;
//
//import com.example.message.vo.SimpleMessageVO;
//
//
///**
// * @author Chen
// * @date   Sep 6, 2019
// * @description MqScheduledConfig.java	
// */
//@Configuration
//@EnableScheduling
//public class MqScheduledConfig {
//
//	private static final Logger LOGGER = LoggerFactory.getLogger(MqScheduledConfig.class);
//
//	@Autowired
//	private SimpMessagingTemplate jmsTemplate;
//
//	@Scheduled(fixedRate = 5000) // every 5 seconds
//	public void publishUpdates() {
//		String uuid = UUID.randomUUID().toString();
//
//		LOGGER.info("Sending message: " + uuid);
//
//		jmsTemplate.convertAndSend("/topic/msg", new SimpleMessageVO(uuid));
//	}
//
//}