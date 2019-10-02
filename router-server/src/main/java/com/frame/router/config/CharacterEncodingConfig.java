///**
// * 
// */
//package com.frame.router.config;
//
//import org.springframework.boot.SpringBootConfiguration;
//import org.springframework.boot.web.servlet.FilterRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.web.filter.CharacterEncodingFilter;
//
///**
// * 字符集配置.
// * 
// * @ClassName: OtherConfig
// * @Description: 其他配置
// * @author yujunnan
// * @date 2017年4月30日 下午4:02:09
// *
// */
//@SpringBootConfiguration
//public class CharacterEncodingConfig {
//
//	@SuppressWarnings("rawtypes")
//	@Bean
//	public FilterRegistrationBean filterRegistrationBean() {
//		FilterRegistrationBean registrationBean = new FilterRegistrationBean();
//		CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
//		characterEncodingFilter.setForceEncoding(true);
//		characterEncodingFilter.setEncoding("UTF-8");
//		registrationBean.setFilter(characterEncodingFilter);
//		return registrationBean;
//	}
//
//}
