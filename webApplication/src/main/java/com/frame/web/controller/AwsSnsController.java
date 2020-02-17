package com.frame.web.controller;

 

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.frame.web.service.AWSMessageService;


/**
 * @author Chen
 * @date   Jan 9, 2020
 * @description AwsSnsController.java	
 * 			Test for send message through AWS SNS
 */
@RestController
@RequestMapping(value = "/aws")
public class AwsSnsController {
	protected static final Logger logger = LoggerFactory.getLogger(DemoController.class);

	@Autowired
	AWSMessageService awsMessageService;
	
	@RequestMapping(value = "/sendMsg", method = RequestMethod.POST)
	public @ResponseBody String awsMsg(@RequestBody String content,HttpServletRequest req)
			throws Exception {
		System.out.println(content);
		String result = awsMessageService.sendSMSMessage("+16072626112", content);

		return result;
	}
}