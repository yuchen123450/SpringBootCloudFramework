package com.example.manager.common.enums;

public enum TestpointPositionEnum {
	DEFAULT("TestpointPositionEnum.default", 1), 
	TEV_FRONT_MIDDLE("TestpointPositionEnum.tev.front.middle", 2), 
	TEV_FRONT_LOWER("TestpointPositionEnum.tev.front.lower", 3), 
	TEV_BACK_UPPER("TestpointPositionEnum.tev.back.upper", 4), 
	TEV_BACK_MIDDLE("TestpointPositionEnum.tev.back.middle", 5), 
	TEV_BACK_LOWER("TestpointPositionEnum.tev.back.lower", 6), 
	TEV_LATERAL_UPPER("TestpointPositionEnum.tev.lateral.upper", 7), 
	TEV_LATERAL_MIDDLE("TestpointPositionEnum.tev.lateral.middle", 8), 
	TEV_LATERAL_LOWER("TestpointPositionEnum.tev.lateral.lower", 9),
	AE_FRONT("TestpointPositionEnum.ae.front",10),
	AE_BACK("TestpointPositionEnum.ae.back",11),
	UHFPRPS_FRONT("TestpointPositionEnum.uhf.prps.front",12),
	UHFPRPS_BACK("TestpointPositionEnum.uhf.prps.back",13);

	/**
	 * 类型名称.
	 */
	private final String typeName;

	/**
	 * 类型代码.
	 */
	private final Integer typeCode;

	private TestpointPositionEnum(String typeName, Integer typeCode) {
		this.typeCode = typeCode;
		this.typeName = typeName;
	}

	public String getTypeName() {
		return typeName;
	}

	public Integer getTypeCode() {
		return typeCode;
	}
}
