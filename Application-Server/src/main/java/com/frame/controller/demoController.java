/**
 * @author: Chen
 * @date:   Dec 12, 2019
 */
package com.frame.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Chen
 * @date   Dec 12, 2019
 * @description demoController.java	
 */


@RestController
public class demoController {

	@Value("${frame.demo.word}")
	String word;
	
	@RequestMapping(value = "/hello")
	public HashMap<String, Object> get(@RequestParam String name){
		HashMap<String,Object> map = new HashMap<String, Object>();
		map.put("msg", "hello:   " + name + "property changes: " + word);
		return map;
	}
}
