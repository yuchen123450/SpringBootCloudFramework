package com.example.manager.common.enums;

/**
 * 测点管理错误信息枚举
 * @author Yanfa-0509
 * @date 2017年8月2日 下午3:14:48
 * @Title TestpointErrorEnum 	
 * @Description：
 */
public enum TestpointErrorEnum implements BaseErrorEnum {

	TESTPOINT_IS_EXIST("TestpointIsExist","Testpoint is exist"),
	TESTPOINT_NOT_EXIST("TestpointNotExist","Testpoint doesn't exist"),
	ADD_TESTPOINT_ERROR("AddTestpointError","Add Testpoint error"),
	UPDATE_TESTPOINT_ERROR("UpdateTestpointError","Update Testpoint error");

	/** 代码 */
	private final String messageKey;
	/** 信息所属的key */
	private final String messageDefault;

	TestpointErrorEnum(String messageKey, String messageDefault) {
		this.messageKey = messageKey;
		this.messageDefault = messageDefault;
	}

	@Override
	public String getMessageKey() {
		// TODO Auto-generated method stub
		return messageKey;
	}

	@Override
	public String getMessageDefault() {
		// TODO Auto-generated method stub
		return messageDefault;
	}
}
