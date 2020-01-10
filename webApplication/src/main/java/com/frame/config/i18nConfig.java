/**
 * @author: Chen
 * @date:   Dec 17, 2019
 */
package com.frame.config;

import java.net.URL;
import java.net.URLClassLoader;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionOutcome;
import org.springframework.boot.autoconfigure.web.ServerProperties.Tomcat.Resource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;

import com.frame.loader.DiskClassLoader;

/**
 * @author Chen
 * @date   Dec 17, 2019
 * @description localConfig.java	
 */
@Configuration
public class i18nConfig {
	
	@Value("${spring.i18n.path}")
	String i18nDir;
	
	@Value("${spring.messages.basename}")
	String basename;
	
    @Bean(name = "messageSource")
    public ResourceBundleMessageSource getMessageSource() throws Exception {
        
    	ResourceBundleMessageSource resourceBundleMessageSource = new ResourceBundleMessageSource();
        resourceBundleMessageSource.setDefaultEncoding("UTF-8");
		URL[] urls=new URL[1];
		urls[0] = new URL("file:///"+i18nDir);
        ClassLoader loader = new URLClassLoader(urls);
        
        resourceBundleMessageSource.setBeanClassLoader(loader);
        resourceBundleMessageSource.setBundleClassLoader(loader);
        
        resourceBundleMessageSource.setBasenames(basename);

        return resourceBundleMessageSource;
    }
    
}