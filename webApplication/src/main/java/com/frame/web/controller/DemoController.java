package com.frame.web.controller;

import java.net.URL;
import java.net.URLClassLoader;
import java.util.Locale;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UrlPathHelper;

import com.frame.loader.DiskClassLoader;


/**
 * @author Chen
 * @date   Jan 9, 2020
 * @description DemoController.java	
 * 				Test for Spring i18n get message
 */
@RestController
@RequestMapping(value = "/demo")
public class DemoController {
	protected static final Logger logger = LoggerFactory.getLogger(DemoController.class);

	@Autowired
	MessageSource messageSource;
	
	@RequestMapping(value = "/1", method = RequestMethod.POST)
	public @ResponseBody String demo(@RequestBody String language,HttpServletRequest req)
			throws Exception {
		Locale locale2 = new Locale(language);
		Locale locale1 = Locale.SIMPLIFIED_CHINESE;
		String result = messageSource.getMessage("welcome", null, "",locale1);
		System.out.println(messageSource.getMessage("welcome", null, "",locale2));
		System.out.println(messageSource.getMessage("welcome", null, "",locale1));
		System.out.println(locale2.toString());
		System.out.println(locale1.toString());

		return result;
	}
}
