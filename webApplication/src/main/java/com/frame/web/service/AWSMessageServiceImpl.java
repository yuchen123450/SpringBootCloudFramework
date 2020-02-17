/**
 * @author: Chen
 * @date:   Jan 10, 2020
 */
package com.frame.web.service;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClient;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import com.amazonaws.services.sns.model.MessageAttributeValue;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;
import com.frame.config.AwsConfiguration;

/**
 * @author Chen
 * @date   Jan 10, 2020
 * @description AWSMessageServiceImpl.java	
 */
@Service
public class AWSMessageServiceImpl implements AWSMessageService{
	protected static final Logger logger = LoggerFactory.getLogger(AWSMessageServiceImpl.class);

	@Autowired
    private AwsConfiguration awsConfig;
    @Autowired
    private AWSauthService authService;
    @Autowired
    private AmazonSNS amazonSns;

    @Bean
    private AmazonSNS amazonSnsClient() {
        AmazonSNSClientBuilder builder = AmazonSNSClient.builder();
        builder.withCredentials(authService.getCredentialProvider());
        builder.withRegion(awsConfig.getRegion());
        AmazonSNS client = builder.build();
        return client;
    }

    public String sendSMSMessage(String phoneNumber, String content) throws InstantiationException, IllegalAccessException{
        //String message = "My SMS message";
        Map<String, MessageAttributeValue> smsAttributes =
                new HashMap<String, MessageAttributeValue>();
        //<set SMS attributes>
        smsAttributes.put("AWS.SNS.SMS.MaxPrice", new MessageAttributeValue()
                .withStringValue("0.50") //Sets the max price to 0.50 USD.
                .withDataType("Number"));
        smsAttributes.put("AWS.SNS.SMS.SenderID", new MessageAttributeValue()
                .withStringValue("mySenderID") //The sender ID shown on the device.
                .withDataType("String"));
        
        PublishResult result = amazonSns.publish(new PublishRequest()
                            .withMessage(content)
                            .withPhoneNumber(phoneNumber)
                            .withMessageAttributes(smsAttributes));
        logger.info("message ID:{}",result.getMessageId()); // Prints the message ID.
        return "";
    }
}
