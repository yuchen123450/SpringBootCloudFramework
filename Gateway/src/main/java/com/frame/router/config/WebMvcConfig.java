package com.frame.router.config;

import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author Chen
 * @date   Sep 27, 2019
 * @description WebMvcConfig.java	
 */
public class WebMvcConfig {
	@Bean
	public WebMvcConfigurer corsConfigurer() {
	    return new WebMvcConfigurer() {
	        public void addCorsMappings(CorsRegistry registry) {
	            registry.addMapping("/path-1/**")
	                    .allowedOrigins("https://allowed-origin.com")
	                    .allowedMethods("POST");						// only allow post request to go cross origin 
	        }
	    };
	}
}
