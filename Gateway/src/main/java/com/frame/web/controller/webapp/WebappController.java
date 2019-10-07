package com.frame.web.controller.webapp;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebappController {

	@RequestMapping(value = { "/login"})
	public String webapp(HttpServletRequest request) {
		return "index";
	}
	
	@RequestMapping(value = "/")
	public String web(HttpServletRequest request) {
		return "index";
	}
}
