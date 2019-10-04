/**
 * @author: Chen
 * @date:   Sep 6, 2019
 */
package com.frame.web.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.frame.manager.base.vo.GeneralResVO;
import com.frame.message.vo.SimpleMessageVO;
import com.frame.mq.util.ActiveMqUtil;
/**
 * @author Chen
 * @date   Sep 6, 2019
 * @description MsgRestController.java	
 */

@RestController
@RequestMapping(value = "/hello")
public class ProducerController {
	/*
	 * 消息生产者
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/sendmsg",method = RequestMethod.POST)
	public @ResponseBody GeneralResVO sendmsg(@RequestBody SimpleMessageVO simpleMessageVO ,HttpServletRequest request) throws InstantiationException, IllegalAccessException {
		ActiveMqUtil activeMqUtil = new ActiveMqUtil();
		int ans=activeMqUtil.produceTopic(simpleMessageVO.getTopic(), simpleMessageVO.getMsg(), 0);
		return ans==1?GeneralResVO.returnSuccessResult(ans):GeneralResVO.returnErrorResult(ans);
	}
 
}