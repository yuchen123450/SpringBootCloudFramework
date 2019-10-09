package com.example.manager.common.enums;

public enum StateTestpointEnum {
	normal("正常", 0), 
	info("预警", 1),
	error("报警", 2);
	
	private final String name;
	
	private final int code;
	
	private StateTestpointEnum(String name, int code) {
		this.name = name;
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public int getCode() {
		return code;
	}
	
	/**
	 * 根据名称获取ENUM.
	 * 
	 * @param unitSymbol
	 *            单位名称
	 * @return UnitEnum
	 */
	public static StateTestpointEnum getByUnitSymbol(String unitSymbol) {
		for (StateTestpointEnum resultCode : StateTestpointEnum.values()) {
			if (resultCode.getName().equals(unitSymbol)) {
				return resultCode;
			}
		}

		return null;
	}

	/**
	 * 根据代号获取ENUM.
	 * 
	 * @param code
	 *            代号
	 * @return UnitEnum
	 */
	public static StateTestpointEnum getByCode(int code) {
		for (StateTestpointEnum resultCode : StateTestpointEnum.values()) {
			if (resultCode.getCode() == code) {
				return resultCode;
			}
		}

		return null;
	}
}
