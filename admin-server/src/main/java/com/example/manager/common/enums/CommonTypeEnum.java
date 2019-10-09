package com.example.manager.common.enums;

/**
 * 通用类型枚举
 * @author Yanfa-0509
 * @date 2017年8月3日 下午3:27:47
 * @Title CommonTypeEnum 	
 * @Description：
 */
public enum CommonTypeEnum {

    ZTJCLX(1),//状态监测类型
    DYDJ(2),//电压等级
    SBLX(3),//一次设备类型
    CSZT(4),//测试状态
    JBFDLX(5),//局部放电类型
    CGQLX(6),//传感器类型
    JGXS(7),//结构形式
    JCZQ(8),//检测周期
    SJLX(9),//数据类型
    HLTJ(10),//衡量条件
    HLJZ(11),//衡量基准
    CLLX(12),//材料类型
    JXTXZDJL(12),//机械特性诊断结论
    XB(14),//相别
    JXTXFHZ(15),//机械特性分合闸
    JXTXSJLX(16),//机械特性数据类型
    JCSBLX(17),//监测设备类型
    DKLBLX(18),//带宽/滤波类型 
    CGQQDLX(19),//传感器/前端类型
    TDLX(20),//通道类型
    SJZLX(21);//数据组类型
    /** 代码 */
    private final int code;

    CommonTypeEnum(int code) {
        this.code = code;
    }
    

    /**
     * 根据code获取ENUM
     * 
     * @param code
     * @return
     */
    public static CommonTypeEnum getByCode(int code) {
        for (CommonTypeEnum resultCode : CommonTypeEnum.values()) {
            if (resultCode.getCode()==code) {
                return resultCode;
            }
        }

        return null;
    }


	public int getCode() {
		return code;
	}
}
