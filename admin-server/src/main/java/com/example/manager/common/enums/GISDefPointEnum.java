package com.example.manager.common.enums;

public enum GISDefPointEnum {
	GIS_ULTRASONIC("GISDefPointEnum.gis.ultrasonic",0),
	GIS_UHF("GISDefPointEnum.gis.uhf",1);
	
	/**
	 * 类型名称.
	 */
	private final String typeName;

	/**
	 * 类型代码.
	 */
	private final Integer typeCode;
	
	private GISDefPointEnum(String typeName, Integer typeCode) {
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
