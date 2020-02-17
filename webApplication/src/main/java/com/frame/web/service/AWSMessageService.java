/**
 * @author: Chen
 * @date:   Jan 10, 2020
 */
package com.frame.web.service;

/**
 * @author Chen
 * @date   Jan 10, 2020
 * @description AWSMessageService.java	
 */
public interface AWSMessageService {
	public String sendSMSMessage(String phoneNumber,String content) throws InstantiationException, IllegalAccessException;
}
