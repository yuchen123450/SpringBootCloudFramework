/**
 * 
 */
package com.frame.router.config;

import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.web.filter.CharacterEncodingFilter;

/**
 * String
 */
@SpringBootConfiguration
public class CharacterEncodingConfig {

	@SuppressWarnings("rawtypes")
	@Bean
	public FilterRegistrationBean filterRegistrationBean() {
		FilterRegistrationBean registrationBean = new FilterRegistrationBean();
		CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
		characterEncodingFilter.setForceEncoding(true);
		characterEncodingFilter.setEncoding("UTF-8");
		registrationBean.setFilter(characterEncodingFilter);
		return registrationBean;
	}

}
