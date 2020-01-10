package com.frame.web.controller;

 

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * @author Chen
 * @date   Jan 9, 2020
 * @description HelloController.java	
 * 			Test for return static html componenet
 */
@Controller
public class HelloController {

    @RequestMapping("/hello")
    public String hello(){
       return  "/hello";
    }
}