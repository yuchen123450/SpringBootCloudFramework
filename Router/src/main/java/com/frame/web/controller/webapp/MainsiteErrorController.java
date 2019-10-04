package com.frame.web.controller.webapp;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

//import com.alibaba.fastjson.JSON;

@Controller
public class MainsiteErrorController implements ErrorController {

	@RequestMapping("/error")
    public String handleError(HttpServletRequest request){
        //获取statusCode:401,404,500
        Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
//        System.out.println(JSON.toJSONString(request));
        if(statusCode == 401){
            return "exception";
        }else if(statusCode == 404){
            return "exception";
        }else if(statusCode == 403){
            return "exception";
        }else{
            return "exception";
        }

    }

	@Override
	public String getErrorPath() {
		return "/error";
	}

}
