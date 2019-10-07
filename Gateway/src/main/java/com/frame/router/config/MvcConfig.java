package com.frame.router.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.util.UrlPathHelper;
//import com.frame.manager.interceptor.AuthorizationInterceptor;

//import com.frame.manager.interceptor.AuthorizationInterceptor;

import java.io.File;
import java.util.List;

/**
 * 
 */
@SpringBootConfiguration
public class MvcConfig extends WebMvcConfigurerAdapter {

//	@Value("${file.uploadpath}")
//	String uploadPath;

	@Value("${staticfile.path}")
	String staticfilePath;

	/**
	 * 重写configurePathMatch，用于解决前端将#转义为%23后，服务端返回400的错误，详情参加下方地址：
	 * https://blog.csdn.net/ColdFireMan/article/details/86552242
	 */
	@Override
	public void configurePathMatch(PathMatchConfigurer configurer) {
		UrlPathHelper urlPathHelper = new UrlPathHelper();
		urlPathHelper.setUrlDecode(false);
		configurer.setUrlPathHelper(urlPathHelper);
		System.out.println("Config path match");
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		System.out.println("interceptor");
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		/**
		 * 资源映射路径 addResourceHandler：访问映射路径 addResourceLocations：资源绝对路径
		 */
		registry.addResourceHandler("/**").addResourceLocations("file:" + staticfilePath);
//		registry.addResourceHandler("/resource/**").addResourceLocations("file:" + uploadPath + File.separator);
		super.addResourceHandlers(registry);
	}
}
