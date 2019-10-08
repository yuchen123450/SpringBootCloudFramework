/**
 * @author: Chen
 * @date:   Sep 6, 2019
 */
package com.frame.web.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.frame.manager.base.vo.GeneralResVO;
import com.frame.message.vo.KafkaMessageVO;
import com.frame.message.vo.SimpleMessageVO;
import com.frame.mq.util.ActiveMqUtil;
import com.frame.mq.util.KafkaUtil;
import com.frame.mq.util.RabbitUtil;
/**
 * @author Chen
 * @date   Sep 6, 2019
 * @description MsgRestController.java	
 */

@RestController
@RequestMapping(value = "/producer")
public class ProducerController {
	
	@Autowired
	RabbitUtil rabbitUtil;
	
	/*
	 * 消息生产者
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/sendmsg/activemq",method = RequestMethod.POST)
	public @ResponseBody GeneralResVO sendmsg(@RequestBody SimpleMessageVO simpleMessageVO ,HttpServletRequest request) throws InstantiationException, IllegalAccessException {
		ActiveMqUtil activeMqUtil = new ActiveMqUtil();
		int ans=activeMqUtil.produceTopic(simpleMessageVO.getTopic(), simpleMessageVO.getMsg(), 0);
		return ans==1?GeneralResVO.returnSuccessResult(ans):GeneralResVO.returnErrorResult(ans);
	}
	
	/*
	 * 消息生产者
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/sendmsg/kafka",method = RequestMethod.POST)
	public @ResponseBody GeneralResVO sendmsg(@RequestBody KafkaMessageVO kafkaMessageVO ,HttpServletRequest request) throws InstantiationException, IllegalAccessException {
		KafkaUtil kafkaUtil = new KafkaUtil();
		GeneralResVO res= kafkaUtil.asyncSendToKafka(kafkaMessageVO);
		return res;
	}
	
	/*
	 * 消息生产者
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/sendmsg/rabbit",method = RequestMethod.POST)
	public @ResponseBody GeneralResVO sendmsg2(@RequestBody SimpleMessageVO simpleMessageVO ,HttpServletRequest request) throws InstantiationException, IllegalAccessException {
//		RabbitUtil rabbitUtil = new RabbitUtil();
		int ans=rabbitUtil.sendTo(simpleMessageVO.getTopic(), simpleMessageVO.getMsg());
		return ans==1?GeneralResVO.returnSuccessResult(ans):GeneralResVO.returnErrorResult(ans);
	}
	
}