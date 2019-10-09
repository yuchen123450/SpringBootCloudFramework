package com.example.manager.common.enums;

/**
 * 巡检测点检测信息表（XJ_TESTPOINT_TESTINFO）对应的检测类型枚举
 * @author wsh
 * @date 2016年8月9日 上午11:02:57
 * @Title XjTestTypeEnum 	
 * @Description：
 */
public enum XjTestTypeEnum {

	TEVAmp("TEV测试幅值",0),
	AEAmp("AE测试幅值",1),
	AEWave("AE波形",2),
	AEPhase("AE相位",3),
	AEAmplitude("AE幅值图谱",4),
	AEFlight("AE飞行",5),
	UHFAmp("UHF测试幅值",6),
	UHFPRPS("UHF PRPS和PRPD图谱",7),
	UHFPer("UHF周期",8),
	HFCTAmp("HFCT测试幅值",9),
	HFCTPRPS("HFCT PRPS和PRPD图谱",10),
	HFCTPer("HFCT周期",11),
	Infrared("红外",12),
	MECH("机械特性",13),
	G1500IMG("",14),
	G1500DATA("",15),
	G1500CHCFG("",16),
	Photo("",17),
	Voice("",18),
	Video("",19),
	Txt("",20),
	UHFPRPD("",21),
	HFCTPRPSVideo("HFCT PRPS 回放数据",22),
	TEVPRPS("TEV PRPS和PRPD图谱数据类型", 23);

	/**
	 * 类型名称
	 */
	private final String typeName;
	
	/**
	 * 类型编码
	 */
	private final Integer typeCode;
	
	private XjTestTypeEnum(String typeName,Integer typeCode){
		this.typeName=typeName;
		this.typeCode=typeCode;
	}
	
	public String getTypeName(){
		return typeName;
	}
	
	public Integer getTypeCode(){
		return typeCode;
	}
	
	/**
	 * 根据检测类型编码获取检测类型名称
	 * @author:wsh
	 * @DateTime:2016年8月9日 上午11:22:11
	 * @param typeCode
	 * @return
	 */
	public static XjTestTypeEnum getByTypeCode(Integer typeCode){
		for(XjTestTypeEnum testType:XjTestTypeEnum.values()){
			if(testType.getTypeCode()==typeCode){
				return testType;
			}
		}
		return null;
	}
}
