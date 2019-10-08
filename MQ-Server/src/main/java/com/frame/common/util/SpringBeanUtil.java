/**
 * @author: Chen
 * @date:   Oct 7, 2019
 */
package com.frame.common.util;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
/**
 * @author Chen
 * @date   Oct 7, 2019
 * @description SpringBeanUtil.java	
 */
public class SpringBeanUtil implements ApplicationContextAware {
	// Spring应用上下文环境
    private static ApplicationContext applicationContext;

    /**
     * 实现ApplicationContextAware接口的回调方法，设置上下文环境
	 * 
     * @param applicationContext
     */
    public void setApplicationContext(ApplicationContext applicationContext) {
    	SpringBeanUtil.applicationContext = applicationContext;
    }

    /**
     * @return ApplicationContext
     */
    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    /**
     * 获取对象
     * @param name
     * @param <T>
     * @return
     * @throws BeansException
     */
    @SuppressWarnings("unchecked")
    public static <T> T getBean(String name) throws BeansException {
        if (applicationContext == null){
            return null;
        }
        return (T)applicationContext.getBean(name);
    }
}

