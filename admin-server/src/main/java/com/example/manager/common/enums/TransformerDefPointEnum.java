package com.example.manager.common.enums;

public enum TransformerDefPointEnum {

	HFCT_TXC("TransformerDefPointEnum.HFCT.TXC",0),
	HFCT_JJC("TransformerDefPointEnum.HFCT.JJC",1),
	HFCT_GPDL("TransformerDefPointEnum.HFCT.GPDL",1),
	AE_GYC("TransformerDefPointEnum.AE.GYC",1),
	AE_DYC("TransformerDefPointEnum.AE.DYC",1),
	AE_GYCYC("TransformerDefPointEnum.AE.GYCYC",1),
	AE_GYCZC("TransformerDefPointEnum.AE.GYCZC",1),
	AE_ULTRASOUND("TransformerDefPointEnum.AE.ULTRASOUND",1);
	
	/**
	 * 类型名称.
	 */
	private final String typeName;

	/**
	 * 类型代码.
	 */
	private final Integer typeCode;
	
	private TransformerDefPointEnum(String typeName, Integer typeCode) {
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
