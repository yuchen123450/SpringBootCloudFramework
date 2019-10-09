package com.example.manager.common.enums;


/**
 * 一次设备管理错误信息枚举
 * @author Yanfa-0509
 * @date 2017年8月2日 下午3:15:09
 * @Title DeviceErrorEnum 	
 * @Description：
 */
public enum DeviceErrorEnum implements BaseErrorEnum {

	DEVICE_IS_EXIST("DeviceIsExist","DeviceIsExist"),
	DEVICE_NOT_EXIST("DeviceNotExist","DeviceNotExist"),
	ADD_DEVICE_ERROR("AddDeviceError","Add device error"),
	UPDATE_DEVICE_ERROR("UpdateDeviceError","Update device error");

	/** 代码 */
	private final String messageKey;
	/** 信息所属的key */
	private final String messageDefault;

	DeviceErrorEnum(String messageKey, String messageDefault) {
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
