package com.frame.mq.util;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.connect.data.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.KafkaMessageListenerContainer;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;

import com.frame.manager.base.vo.GeneralResVO;
import com.frame.message.vo.KafkaMessageVO;
import com.frame.message.vo.SimpleMessageVO;
import com.frame.mq.property.TopicProperties;

/**
 * @author Chen
 * @date   Oct 3, 2019
 * @description KafkaUtil.java	
 */
@Component
public class KafkaUtil {

	@Autowired
	KafkaAdmin kafkaAdmin;
	
	@Autowired
	KafkaTemplate<String, String> template;
	
	
	
	/**
	 * @param properties
	 * @author: Chen
	 * @time：    Oct 3, 2019
	 * @description: web control to create new topic in Kafka
	 */
	public void createNewTopic(TopicProperties properties) {
	    AdminClient client = AdminClient.create(kafkaAdmin.getConfig());
	    NewTopic newTopic = new NewTopic(properties.getName(), properties.getPartitions(), properties.getReplicas());
	    List<NewTopic> tList = new ArrayList<>();
	    tList.add(newTopic);
	    client.createTopics(tList);
	    client.close();
	}
	
	/**
	 * @param data
	 * @author: Chen
	 * @time：    Oct 3, 2019
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 * @description: A
	 */
	@SuppressWarnings("rawtypes")
	public GeneralResVO asyncSendToKafka(final KafkaMessageVO data) throws InstantiationException, IllegalAccessException {
	    try {
	    	final ProducerRecord<String, String> record = createRecord(data);
		    ListenableFuture<SendResult<String, String>> future = template.send(record);
		    
		    future.addCallback(callback());
		    return GeneralResVO.returnSuccessResult(new Date().toString());
	    } catch (Exception e) {
			return GeneralResVO.returnErrorResult(null);
		}
	    
	}

	/****** general callback handler ********/
	
	@SuppressWarnings("rawtypes")
	public ListenableFutureCallback<? super SendResult<String, String>> callback(){
		return new ListenableFutureCallback(){
			@Override
			public void onFailure(Throwable ex) {
				
			}

			@Override
			public void onSuccess(Object result) {
				System.out.println(result.toString());
			}
		
		};
	}
	
	
	/**
	 * @param data
	 * @return
	 * @author: Chen
	 * @time：    Oct 3, 2019
	 * @description:
	 */
	private ProducerRecord<String, String> createRecord(KafkaMessageVO data) {
		
		return null;
	}

//		private KafkaMessageListenerContainer<Integer, String> createContainer(
//            ContainerProperties containerProps) {
//			Map<String, Object> props = consumerProps();
//			DefaultKafkaConsumerFactory<Integer, String> cf =
//			                new DefaultKafkaConsumerFactory<Integer, String>(props);
//			KafkaMessageListenerContainer<Integer, String> container =
//			                new KafkaMessageListenerContainer<>(cf, containerProps);
//			return container;
//		}
//			
//		private KafkaTemplate<Integer, String> createTemplate() {
//			Map<String, Object> senderProps = senderProps();
//			ProducerFactory<Integer, String> pf =
//			  new DefaultKafkaProducerFactory<Integer, String>(senderProps);
//			KafkaTemplate<Integer, String> template = new KafkaTemplate<>(pf);
//			return template;
//		}
			
//		private Map<String, Object> consumerProps() {
//			Map<String, Object> props = new HashMap<>();
//			props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
//			props.put(ConsumerConfig.GROUP_ID_CONFIG, group);
//			props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
//			props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "100");
//			props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "15000");
//			props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, IntegerDeserializer.class);
//			props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//			return props;
//		}
//			
//		private Map<String, Object> senderProps() {
//			Map<String, Object> props = new HashMap<>();
//			props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
//			props.put(ProducerConfig.RETRIES_CONFIG, 0);
//			props.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
//			props.put(ProducerConfig.LINGER_MS_CONFIG, 1);
//			props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);
//			props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, IntegerSerializer.class);
//			props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
//			return props;
//		}

}
