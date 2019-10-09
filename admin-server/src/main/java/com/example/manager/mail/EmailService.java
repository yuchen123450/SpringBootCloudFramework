/**
 * @author: Chen
 * @date:   Mar 14, 2019
 */
package com.example.manager.mail;

/**
 * @author Chen
 * @date   Mar 14, 2019
 * @description mailService.java	
 */
public interface EmailService {
	public void sendSimpleMessage(String to, String subject, String text) ;
}
