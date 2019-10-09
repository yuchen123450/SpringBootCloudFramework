package com.example.manager.common.enums;

/**
 * 返回结果类型枚举
 * 
 * @author Yanfa-0509
 * @date 2017年6月30日 下午2:40:20
 * @Title ResultCodeEnum @Description：
 */
public enum ResultCodeEnum {

	//成功
	SUCCESS(10000),
	//token过期
	TOKEN_EXPIRED(10001),
	//系统错误
	SYSTEM_ERROR(10004),
	//参数错误
	PARAM_ERROR(10006),
	//请求不存在
	REQUEST_NOT_EXIST(10007),
	//未选择数据
	NO_DATA_SELECTED(10008),
	//业务内部错误
	BUSSINESS_ERROR(2002001),
	//国家重名
	COUNTRY_NAME_EXIST(2002002),
	//电力公司重名
	COMAPANY_NAME_EXIST(2002003),
	//变电站重名
	SUBSATION_NAME_EXIST(2002004),
	//新增变电站出错
	SUBSTATION_ADD_ERROR(2002005),
	//更新变电站错误
	SUBSTATION_UPDATE_ERROR(2002006),
	//站点含有设备
	SUBSTATION_HAS_DEVICE(2002007),
	//设备分组（间隔单元）重名
	GROUP_NAME_EXIST(2002008),
	//变电站不存在
	SUBSATION_NOT_EXIST(2002009),
	//设备分组（间隔单元）不存在
	GROUP_NOT_EXIST(2002010),
	//电力设备已存在
	DEVICE_IS_EXIST(2002011),
	//电力设备不存在
	DEVICE_NOT_EXIST(2002012),
	//测点已存在
	TESTPOINT_IS_EXIST(2002013),
	//测点不存在
	TESTPOINT_NOT_EXIST(2002014),
	//新建测点错误
	TESTPOINT_ADD_ERROR(20020015),
	//更新测点错误
	TESTPOINT_UPDATE_ERROR(2002016),
	//所有设备都已有测点
	SELECTED_DEVICES_HAVE_TESTPOINTS(2002017),
	//间隔单元下存在一次设备
	BAY_HAS_DEVICE(2002018),
	//不可删除自己所在电力单位
	COMPANY_CANNOT_DELETESELF(2002019),
	//测点模板已存在
	TESTPOINT_TEMPLATE_EXISTS(2002020),
	//用户所在公司无权修改该测点模板
	COMPANY_CANNOT_MODIFY(2002021),
	//测点模板纪录已存在
	TESTPOINT_TEMPLATE_DETAIL_EXISTS(2002023),
	//用户所在公司无权删除该纪录
	COMPANY_CANNOT_DELETE(2002022);

	/** 代码 */
	private final int code;

	ResultCodeEnum(int code) {
		this.code = code;
	}

	/**
	 * 根据code获取ENUM
	 * 
	 * @param code
	 * @return
	 */
	public static ResultCodeEnum getByCode(int code) {
		for (ResultCodeEnum resultCode : ResultCodeEnum.values()) {
			if (resultCode.getCode() == code) {
				return resultCode;
			}
		}

		return null;
	}

	public int getCode() {
		return code;
	}
}
