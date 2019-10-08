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
import com.frame.message.vo.SimpleMessageVO;
import com.frame.mq.util.RabbitUtil;
/**
 * @author Chen
 * @date   Sep 6, 2019
 * @description MsgRestController.java	
 */

@RestController
@RequestMapping(value = "/consumer")
public class ConsumerController {
	
	@Autowired
	RabbitUtil rabbitUtil;
	
	/*
	 * 配置消费者
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/rabbit",method = RequestMethod.POST)
	public @ResponseBody GeneralResVO setListener(@RequestBody SimpleMessageVO simpleMessageVO ,HttpServletRequest request) throws InstantiationException, IllegalAccessException {
		int ans=rabbitUtil.createQueue(simpleMessageVO.getTopic());
		return ans==1?GeneralResVO.returnSuccessResult(ans):GeneralResVO.returnErrorResult(ans);
	}

	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/rabbit/destroy",method = RequestMethod.POST)
	public @ResponseBody GeneralResVO destroyListener(@RequestBody SimpleMessageVO simpleMessageVO ,HttpServletRequest request) throws InstantiationException, IllegalAccessException {
		int ans=rabbitUtil.createQueue(simpleMessageVO.getTopic());
		return ans==1?GeneralResVO.returnSuccessResult(ans):GeneralResVO.returnErrorResult(ans);
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/rabbit/clear",method = RequestMethod.POST)
	public @ResponseBody GeneralResVO clearListener(@RequestBody SimpleMessageVO simpleMessageVO ,HttpServletRequest request) throws InstantiationException, IllegalAccessException {
		int ans=rabbitUtil.clearQueue();
		return ans>0?GeneralResVO.returnSuccessResult(ans):GeneralResVO.returnErrorResult(ans);
	}

}