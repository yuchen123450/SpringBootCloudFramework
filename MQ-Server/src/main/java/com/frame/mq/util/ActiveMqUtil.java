/**
 * @author: Chen
 * @date:   Sep 12, 2019
 */
package com.frame.mq.util;

import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.JMSException;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.jms.Topic;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
/**
 * @author Chen
 * @date   Sep 12, 2019
 * @description ActiveMqUtil.java	
 */

@Component
public class ActiveMqUtil {
	protected static final Logger logger = LoggerFactory.getLogger(ActiveMqUtil.class);
	
	@Value("${spring.activemq.broker-url}")
	String brokerAddress;
	
	@Value("${spring.activemq.user}")
	String user;
	
	@Value("${spring.activemq.password}")
	String pwd;
	
	/**
	 *@author: 		Chen
	 *@date:  		Aug 30, 2019
	 *@description:	Produce a topic for use
	 *@location:
	 */
	public int produceTopic(String subject, String context, Integer time)
			throws InstantiationException, IllegalAccessException {
		try {
			ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory(user,pwd,brokerAddress);		// connect to activeMQ server
			Connection connection = factory.createConnection();			
			connection.start();																				// start the connection
			Session session = connection.createSession(Boolean.TRUE, Session.AUTO_ACKNOWLEDGE);				// create a new session
			
			// 创建主题
			Topic topic = session.createTopic(subject);														// create a topic under that session
			MessageProducer producer = session.createProducer(topic);										// create producer under the topic
			
			// NON_PERSISTENT 非持久化 PERSISTENT 持久化
			producer.setDeliveryMode(DeliveryMode.PERSISTENT);
			TextMessage message = session.createTextMessage();												// create message
			message.setText(context);																		// set message body context our "input"
			message.setStringProperty("property", "消息Property");
			
			// 发布主题消息
			producer.send(message);																			// send message 
			System.out.println("Sent topic: " + subject);
			System.out.println("Sent message: " + context);
			session.commit();																				// commit the change
			session.close();																				// close session
			connection.close();																				// close connection
			
			return 1;
		} 
		catch (JMSException e) {
			logger.error(e.toString());
			return 0;
		}
	}
}
