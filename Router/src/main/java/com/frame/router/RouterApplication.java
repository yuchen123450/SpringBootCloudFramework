package com.frame.router;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import com.frame.router.filter.ErrorFilter;
import com.frame.router.filter.PostFilter;
import com.frame.router.filter.PreFilter;
import com.frame.router.filter.TokenFilter;

@SpringBootApplication
@EnableEurekaClient
@EnableZuulProxy
@ComponentScan(basePackages = "com.frame")
public class RouterApplication {
	public static Date date;
	private static Logger logger = LoggerFactory.getLogger(RouterApplication.class);
	
	public static void main(String[] args) {
		SpringApplication.run(RouterApplication.class, args);
	}
	@Bean
	public PreFilter preFilter() {
		return new PreFilter();
	}

	@Bean
	public PostFilter postFilter() {
		return new PostFilter();
	}

	@Bean
	public ErrorFilter errorFilter() {
		return new ErrorFilter();
	}

	@Bean
	public TokenFilter routeFilter() {
		return new TokenFilter();
	}
}
