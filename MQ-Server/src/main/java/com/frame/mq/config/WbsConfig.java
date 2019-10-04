package com.frame.mq.config;
///**
// * @author: Chen
// * @date:   Sep 6, 2019
// */
//package com.example.kafka.config;
//import org.springframework.context.annotation.Configuration;
//
//import org.springframework.messaging.simp.config.MessageBrokerRegistry;
//import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
//import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
//import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
//
///**
// * @author Chen
// * @date   Sep 6, 2019
// * @description WbsConfig.java	
// */
//
//@Configuration //使用Configuration注解标识这是一个Springboot的配置类.
//@EnableWebSocketMessageBroker //使用此注解来标识使能WebSocket的broker.即使用broker来处理消息.
//public class WbsConfig implements WebSocketMessageBrokerConfigurer {
//
//    @Override
//    //实现WebSocketMessageBrokerConfigurer中的此方法，配置消息代理（broker）
//    public void configureMessageBroker(MessageBrokerRegistry config) {
//        config.enableSimpleBroker("/topic"); //启用SimpleBroker，使得订阅到此"topic"前缀的客户端可以收到greeting消息.
//        config.setApplicationDestinationPrefixes("/app"); //将"app"前缀绑定到MessageMapping注解指定的方法上。如"app/hello"被指定用greeting()方法来处理.
//    }
//
//    @Override
//    //用来注册Endpoint，“/gs-guide-websocket”即为客户端尝试建立连接的地址。
//    public void registerStompEndpoints(StompEndpointRegistry registry) {
//        registry.addEndpoint("/gs-guide-websocket").withSockJS();
//    }
//
//}