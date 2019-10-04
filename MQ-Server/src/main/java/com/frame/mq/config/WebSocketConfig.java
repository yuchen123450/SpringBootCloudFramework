package com.frame.mq.config;
///**
// * @author: Chen
// * @date:   Sep 6, 2019
// */
//package com.example.kafka.config;
//
///**
// * @author Chen
// * @date   Sep 6, 2019
// * @description WebSocketConfig.java	
// */
//import org.springframework.context.annotation.Configuration;
//import org.springframework.messaging.simp.config.MessageBrokerRegistry;
//import org.springframework.web.socket.config.annotation.EnableWebSocket;
//import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
//import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurationSupport;
//
//@Configuration
//@EnableWebSocket
//public class WebSocketConfig extends WebSocketMessageBrokerConfigurationSupport {
//
//	@Override
//	protected void registerStompEndpoints(StompEndpointRegistry registry) {
//		registry.addEndpoint("/message").setAllowedOrigins("*").withSockJS();
//	}
//
//	@Override
//	public void configureMessageBroker(MessageBrokerRegistry config) {
//		config.enableStompBrokerRelay("/topic").setRelayHost("localhost").setRelayPort(61613).setClientLogin("admin")
//				.setClientPasscode("admin");
//		config.setApplicationDestinationPrefixes("/app");
//	}
//
//}