/**
 * @author: Chen
 * @date:   Jan 10, 2020
 */
package com.frame.web.service;

import com.amazonaws.auth.AWSCredentialsProvider;

/**
 * @author Chen
 * @date   Jan 10, 2020
 * @description AWSauthService.java	
 */
public interface AWSauthService {
	public AWSCredentialsProvider getCredentialProvider();
}
