/**
 * @author: Chen
 * @date:   Jan 10, 2020
 */
package com.frame.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.ClasspathPropertiesFileCredentialsProvider;
import com.frame.config.AwsConfiguration;

/**
 * @author Chen
 * @date   Jan 10, 2020
 * @description AWSauthServiceImpl.java	
 */
@Service
public class AWSauthServiceImpl implements AWSauthService{
	
	@Autowired
	private AwsConfiguration config;

	public AWSCredentialsProvider getCredentialProvider() {

		if (config.isLocal()) {
			return new ClasspathPropertiesFileCredentialsProvider(config.getCredentialFile());
	    } 
		else {
	        // It will be controlled by IAM role in aws。
	        return null;
	    }
	}
}
