package com.example.manager.base.vo;

/**
 * Token的Model类，可以增加字段提高安全性，例如时间戳、url签名
 * 
 * @author ScienJus
 * @date 2015/7/31.
 */
public class TokenModel {

	/**
	 * 用户id
	 */
	private Integer userID;

	/**
	 * 用户名称
	 */
	private String userName;

	/**
	 * 所属单位ID
	 */
	private Long companyID;

	/**
	 * 所属单位名称
	 */
	private String companyName;

	/**
	 * 客户端类型
	 */
	private Integer clientType;

	/**
	 * 源token，采用随机生成的uuid
	 */
	private String originToken;

	public Long getCompanyID() {
		return companyID;
	}

	public void setCompanyID(Long companyID) {
		this.companyID = companyID;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getOriginToken() {
		return originToken;
	}

	public void setOriginToken(String originToken) {
		this.originToken = originToken;
	}

	public Integer getUserID() {
		return userID;
	}

	public void setUserID(Integer userID) {
		this.userID = userID;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Integer getClientType() {
		return clientType;
	}

	public void setClientType(Integer clientType) {
		this.clientType = clientType;
	}
}
