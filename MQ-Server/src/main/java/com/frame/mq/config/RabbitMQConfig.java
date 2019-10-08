/**
 * @author: Chen
 * @date:   Oct 7, 2019
 */
package com.frame.mq.config;


import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Chen
 * @date   Oct 7, 2019
 * @description RabbitMQConfig.java	
 */
@Configuration
public class RabbitMQConfig {
    
	@Value("${spring.rabbitmq.username}")
	String username;
	@Value("${spring.rabbitmq.password}")
	String password;	

	
	
	@Bean(name = "connectionFactory")
	public ConnectionFactory connectionFactory() {
	CachingConnectionFactory connectionFactory = new CachingConnectionFactory();

	connectionFactory.setUsername(username);
	connectionFactory.setPassword(password);
	connectionFactory.setVirtualHost("/");
//	connectionFactory.setPort(15672);
	connectionFactory.setPublisherConfirms(true);

	// multiple host, high availablity
	// seperate by ","
	connectionFactory.setAddresses("127.0.0.1:15672,localhost:15672,localhost:5672");
	return connectionFactory;
	}
}
