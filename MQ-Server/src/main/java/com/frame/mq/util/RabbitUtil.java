/**
 * @author: Chen
 * @date:   Oct 7, 2019
 */
package com.frame.mq.util;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Chen
 * @date   Oct 7, 2019
 * @description ReceiverUtil.java	
 */

import java.util.concurrent.CountDownLatch;

import javax.annotation.PreDestroy;

import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class RabbitUtil {
    private static final Logger logger = LoggerFactory.getLogger(RabbitUtil.class);

	@PreDestroy
    public void destory() {
        System.out.println("我被销毁了、、、、、我是用的@PreDestory的方式、、、、、、");
        containerPool.clear();
    }
	
	private Map<String, SimpleMessageListenerContainer> containerPool = new HashMap<>();
	
	@Autowired
	ConnectionFactory connectionFactory;
	
	@Autowired
    RabbitTemplate rabbitTemplate;
	
	/******************************* Consumer **************************************/
	public class Receiver{
	    private CountDownLatch latch = new CountDownLatch(1);
	
	    public void receiveMessage(String message) {
	        System.out.println("Received <" + message + ">");
	        latch.countDown();
	    }
	
	    public CountDownLatch getLatch() {
	        return latch;
	    }
    }
	
	public int createQueue(String queueName) {
		SimpleMessageListenerContainer container = createContainer(queueName,connectionFactory, listenerAdapter(new Receiver()));
		containerPool.put(queueName, container);
		return 1;
	}
	
	public int destroyQueue(String queueName) {
		if(containerPool.containsKey(queueName)) {
			containerPool.get(queueName).destroy();
			containerPool.remove(queueName);
			return 1;
		}
		else {
			return 0;
		}
	}
	
	public int clearQueue() {
		int n=containerPool.size();
		containerPool.clear();
		return n;
	}
	
	/******************************* Producer **************************************/
    public int sendTo(String queueName,String message){
        logger.info("Sending> ...");
        this.rabbitTemplate.convertAndSend(queueName,message);
        return 1;
    }
	
	
	/***************************** Support for util  *******************************/
	
    Queue queue(String queueName) {
        return new Queue(queueName, false);
    }

    TopicExchange exchange(String topicExchangeName) {
        return new TopicExchange(topicExchangeName);
    }

    Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("foo.bar.#");
    }
	
	
    SimpleMessageListenerContainer createContainer(String queueName,
    		ConnectionFactory connectionFactory,
            MessageListenerAdapter listenerAdapter) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(queueName);
        container.setMessageListener(listenerAdapter);
        container.start();
        return container;
    }
    
    MessageListenerAdapter listenerAdapter(Receiver receiver) {
        return new MessageListenerAdapter(receiver, "receiveMessage");
    }
}