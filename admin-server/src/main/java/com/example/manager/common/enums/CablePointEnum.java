package com.example.manager.common.enums;

public enum CablePointEnum {

	HFCT_A("CablePointEnum.HFCT.A",0),
	HFCT_B("CablePointEnum.HFCT.B",0),
	HFCT_C("CablePointEnum.HFCT.C",0),
	AE_A("CablePointEnum.AE.A",0),
	AE_B("CablePointEnum.AE.B",1),
	AE_C("CablePointEnum.AE.C",1),
	UHF_A("CablePointEnum.UHF.A",0),
	UHF_B("CablePointEnum.UHF.B",0),
	UHF_C("CablePointEnum.UHF.C",0);
	
	/**
	 * 类型名称.
	 */
	private final String typeName;

	/**
	 * 类型代码.
	 */
	private final Integer typeCode;

	private CablePointEnum(String typeName, Integer typeCode) {
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
