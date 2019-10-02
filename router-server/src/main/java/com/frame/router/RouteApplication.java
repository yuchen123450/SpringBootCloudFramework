package com.frame.router;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
//import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.converter.HttpMessageConverter;
//import org.springframework.retry.annotation.EnableRetry;

import com.alibaba.fastjson.serializer.SerializerFeature;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import com.frame.router.filter.ErrorFilter;
import com.frame.router.filter.PostFilter;
import com.frame.router.filter.PreFilter;
import com.frame.router.filter.TokenFilter;
import com.frame.router.util.PerformanceUtil;

@SpringBootApplication
@EnableEurekaClient
//@EnableCircuitBreaker
@EnableZuulProxy
public class RouteApplication{
	public static Date date;
	private static Logger logger = LoggerFactory.getLogger(RouteApplication.class);
	
	public static void main(String[] args) {
		// initialize a time variable
		date = new Date();
		PerformanceUtil performanceUtil = new PerformanceUtil();
		
		System.out.println("============================================================= Start running router =============================================================");
//        System.err.println("请输入 slave1 或者 slave2");
//        Scanner scanner = new Scanner(System.in);
//        String profiles = scanner.nextLine();//让用户输入端口号
		SpringApplication.run(RouteApplication.class, args);
        System.out.println("============================================================= router starts =============================================================");
        performanceUtil.Eval("router", logger);  
	}
	
//	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
//		return builder.sources(RouteApplication.class);
//	}
//	
//	@Bean
//	public PreFilter preFilter() {
//		return new PreFilter();
//	}
//
//	@Bean
//	public PostFilter postFilter() {
//		return new PostFilter();
//	}
//
//	@Bean
//	public ErrorFilter errorFilter() {
//		return new ErrorFilter();
//	}
//
//	@Bean
//	public TokenFilter routeFilter() {
//		return new TokenFilter();
//	}
//	
//	@Bean
//	public HttpMessageConverters fastjsonHttpMessageConverter() {
//		// 定义一个转换消息的对象
//		FastJsonHttpMessageConverter fastConverter = new FastJsonHttpMessageConverter();
//
//		// 添加fastjson的配置信息 比如 ：是否要格式化返回的json数据
//		FastJsonConfig fastJsonConfig = new FastJsonConfig();
//
//		fastJsonConfig.setSerializerFeatures(SerializerFeature.PrettyFormat, SerializerFeature.WriteNullBooleanAsFalse,
//				SerializerFeature.QuoteFieldNames, SerializerFeature.WriteDateUseDateFormat,
//				SerializerFeature.WriteNullStringAsEmpty, SerializerFeature.WriteMapNullValue);
//
//		// 在转换器中添加配置信息
//		fastConverter.setFastJsonConfig(fastJsonConfig);
//
//		HttpMessageConverter<?> converter = fastConverter;
//
//		return new HttpMessageConverters(converter);
//
//	}


}
