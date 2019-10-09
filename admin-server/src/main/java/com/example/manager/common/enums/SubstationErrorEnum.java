package com.example.manager.common.enums;



/**
 * 变电站管理错误信息枚举
 * @author Yanfa-0509
 * @date 2017年6月30日 下午2:40:04
 * @Title LoginErrorEnum 	
 * @Description：
 */
public enum SubstationErrorEnum implements BaseErrorEnum {

	BDZ_IS_EXIST("SubstationIsExist","SubstationIsExist"),
	SUBSATION_NOT_EXIST("SubstationNotExist","SubstationNotExist"),
	ADD_BDZ_ERROR("AddSubstationError","AddSubstationError"),
	UPDATE_BDZ_ERROR("UpdateBdzError","UpdateSubstationError");

	/** 代码 */
	private final String messageKey;
	/** 信息所属的key */
	private final String messageDefault;

	SubstationErrorEnum(String messageKey, String messageDefault) {
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
