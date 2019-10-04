package com.frame.mq;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;

@SpringBootApplication
@ComponentScan(basePackages = "com.example")
public class MQApplication {
	public static Logger logger = LoggerFactory.getLogger(MQApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(MQApplication.class, args);
    }

//    @PostConstruct()
//    public static void startBroker() {
//    	try {
//    		BrokerService broker = new BrokerService();
//            TransportConnector connector = new TransportConnector();
//            connector.setUri(new URI("tcp://localhost:61616"));
//            broker.addConnector(connector);
////            broker.addConnector("stomp://localhost:61613"); 
//            TransportConnector connector2 = new TransportConnector();
//            connector2.setName("stomp");
//            connector2.setUri(new URI("stomp://localhost:61613"));
//            broker.addConnector(connector2);
//            broker.start();
//		} catch (Exception e) {
//			logger.error("Broker failure:\n"+ e.toString());
//		}
//    	
//    }
    
    @Autowired
    private KafkaTemplate<String, String> template;

    private final CountDownLatch latch = new CountDownLatch(3);

    public void run(String... args) throws Exception {
        this.template.send("bootTest", "outputBinding successfully");
        this.template.send("bootTest", "foo foo foo");
        this.template.send("bootTest", "");
        latch.await(60, TimeUnit.SECONDS);
        logger.info("All received");
    }

    @KafkaListener(topics = "bootTest")
    public void listen(ConsumerRecord<?, ?> cr) throws Exception {
        logger.info(cr.toString());
        latch.countDown();
    }
    
    
    
 }
