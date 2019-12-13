/**
 * @author: Chen
 * @date:   Dec 12, 2019
 */
package com.frame.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

/**
 * @author Chen
 * @date   Dec 12, 2019
 * @description refreshController.java	
 */
@RestController
@RefreshScope
public class refreshController {

	 @Value("${frame.demo.word}")
	 String word;

	 @GetMapping("main")
	 public Mono<String> main() {
		 return Mono.justOrEmpty(word);
	 }
}
