package com.example.manager.common.enums;

/**
 * 系统级代码枚举
 * 
 * @author Yanfa-0509
 * @date 2018年10月22日 下午1:50:12
 * @Title SystemCodeEnum
 * @Description：用于描述系统级代码
 */
public enum SystemCodeEnum implements BaseCodeService {

	// 请求成功
	SUCCESS(10000, "Success"),
	// 未认证或认证已过期
	TOKEN_EXPIRED(10001, "TokenExpired"),
	// 认证信息错误
	TOKEN_ERROR(10002, "TokenError"),
	// 请求超过次数限制
	REQUEST_EXCEED_LIMIT(10003, "RequestExceedLimit"),
	// 系统内部错误
	SYSTEM_ERROR(10004, "SystemError"),
	// 签名验证错误
	SIGN_ERROR(10005, "SignError"),
	// 请求参数错误
	PARAM_ERROR(10006, "ParamError"),
	// 请求不存在
	REQUEST_NOT_EXIST(10007, "RequestNotExist"),
	// 未选择数据
	NO_DATA_SELECTED(10008, "NoDataSelected"),
	USERGROUP_HAS_USER(10009, "UserGroupHasUser"),
	
	ORIGINAL_PASSWORD_ERROR(2003009,"OriPasswordError");
	

	/**
	 * 代码
	 */
	private final int code;

	/**
	 * 代码信息
	 */
	private final String msg;

	SystemCodeEnum(int code, String msg) {
		this.code = code;
		this.msg = msg;
	}

	/**
	 * 根据code获取ENUM
	 * 
	 * @param code
	 * @return
	 */
	public static SystemCodeEnum getByCode(int code) {
		for (SystemCodeEnum resultCode : SystemCodeEnum.values()) {
			if (resultCode.getCode() == code) {
				return resultCode;
			}
		}

		return null;
	}

	public int getCode() {
		return code;
	}

	public String getMsg() {
		return msg;
	}

}
