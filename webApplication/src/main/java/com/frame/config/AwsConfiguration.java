/**
 * @author: Chen
 * @date:   Jan 10, 2020
 */
package com.frame.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author Chen
 * @date   Jan 10, 2020
 * @description AwsConfiguration.java	
 */
@Component
@ConfigurationProperties(prefix = "aws.common")
public class AwsConfiguration {
    private boolean local;
    private String credentialFile;
    private String region;
	/**
	 * @return the local
	 */
	public boolean isLocal() {
		return local;
	}
	/**
	 * @param local the local to set
	 */
	public void setLocal(boolean local) {
		this.local = local;
	}
	/**
	 * @return the credentialFile
	 */
	public String getCredentialFile() {
		return credentialFile;
	}
	/**
	 * @param credentialFile the credentialFile to set
	 */
	public void setCredentialFile(String credentialFile) {
		this.credentialFile = credentialFile;
	}
	/**
	 * @return the region
	 */
	public String getRegion() {
		return region;
	}
	/**
	 * @param region the region to set
	 */
	public void setRegion(String region) {
		this.region = region;
	}
}