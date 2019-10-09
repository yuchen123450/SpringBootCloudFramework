/**
 * @author: Chen
 * @date:   Mar 14, 2019
 */
package com.example.web.controller.mail.test;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.manager.base.vo.GeneralResVO;
import com.example.manager.mail.EmailService;


/**
 * @author Chen
 * @date   Mar 14, 2019
 * @description EmailSender.java	
 */
@RestController
@RequestMapping(value = "/mail")
public class EmailController {
	@Autowired
	EmailService emailService;
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/test")
	public GeneralResVO SendSimpleEmail(HttpServletRequest request)
			throws InstantiationException, IllegalAccessException {
		emailService.sendSimpleMessage("chen@powermdt.com","hello","hello");
		return GeneralResVO.returnSuccessResult(null);
	}
}
