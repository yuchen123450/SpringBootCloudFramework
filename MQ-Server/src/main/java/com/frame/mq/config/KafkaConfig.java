package com.frame.mq.config;

//import static org.junit.Assert.assertTrue;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.concurrent.CountDownLatch;
//import java.util.concurrent.TimeUnit;
//
//import org.apache.kafka.clients.consumer.ConsumerConfig;
//import org.apache.kafka.clients.producer.ProducerConfig;
//import org.junit.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.kafka.annotation.EnableKafka;
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
//import org.springframework.kafka.core.ConsumerFactory;
//import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.kafka.core.ProducerFactory;
//import org.springframework.stereotype.Component;
//
//
// // configuration for embedded kafka 
//public class KafkaConfig {
//	
//	@Component
//	public class Listener {
//
//	    private final CountDownLatch latch1 = new CountDownLatch(1);
//
//	    @KafkaListener(id = "foo", topics = "annotated1")
//	    public void listen1(String foo) {
//	        this.latch1.countDown();
//	    }
//
//	}
//	
//	@Autowired
//	private Listener listener;
//
//	@Autowired
//	private KafkaTemplate<Integer, String> template;
//
//	@Test
//	public void testSimple() throws Exception {
//	    template.send("annotated1", 0, "foo");
//	    template.flush();
//	    assertTrue(this.listener.latch1.await(10, TimeUnit.SECONDS));
//	}
//
//	@Configuration
//	@EnableKafka
//	public class Config {
//
//	    @Bean
//	    ConcurrentKafkaListenerContainerFactory<Integer, String>
//	                        kafkaListenerContainerFactory() {
//	        ConcurrentKafkaListenerContainerFactory<Integer, String> factory =
//	                                new ConcurrentKafkaListenerContainerFactory<>();
//	        factory.setConsumerFactory(consumerFactory());
//	        return factory;
//	    }
//
//	    @Bean
//	    public ConsumerFactory<Integer, String> consumerFactory() {
//	        return new DefaultKafkaConsumerFactory<>(consumerConfigs());
//	    }
//
//	    @Bean
//	    public Map<String, Object> consumerConfigs() {
//	        Map<String, Object> props = new HashMap<>();
//	        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, embeddedKafka.getBrokersAsString());			// embedded kafka
//			props.put(ConsumerConfig.GROUP_ID_CONFIG, group);
//			props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
//			props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "100");
//			props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "15000");
//			props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, IntegerDeserializer.class);
//			props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//	        return props;
//	    }
//
//	    @Bean
//	    public Listener listener() {
//	        return new Listener();
//	    }
//
//	    @Bean
//	    public ProducerFactory<Integer, String> producerFactory() {
//	        return new DefaultKafkaProducerFactory<>(producerConfigs());
//	    }
//
//	    @Bean
//	    public Map<String, Object> producerConfigs() {
//	        Map<String, Object> props = new HashMap<>();
//	        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, embeddedKafka.getBrokersAsString());	        
//			props.put(ProducerConfig.RETRIES_CONFIG, 0);
//			props.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
//			props.put(ProducerConfig.LINGER_MS_CONFIG, 1);
//			props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);
//			props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, IntegerSerializer.class);
//			props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
//	        return props;
//	    }
//
//	    @Bean
//	    public KafkaTemplate<Integer, String> kafkaTemplate() {
//	        return new KafkaTemplate<Integer, String>(producerFactory());
//	    }
//
//	}
//}
