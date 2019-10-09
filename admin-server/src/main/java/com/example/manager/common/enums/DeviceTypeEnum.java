package com.example.manager.common.enums;

/**
 * 一次设备类型枚举
 * 
 * @author Yanfa-0509
 * @date 2017年8月7日 上午8:47:02
 * @Title DeviceTypeEnum @Description：
 */
public enum DeviceTypeEnum {

	UNKNOW("DeviceTypeEnum.UNKNOW", 0),

	TRANSFORMER("DeviceTypeEnum.TRANSFORMER", 1),

	BREAKER("DeviceTypeEnum.BREAKER", 2),

	DISCONNECTOR("DeviceTypeEnum.DISCONNECTOR", 3),

	DISCONNECTING_LINK("DeviceTypeEnum.DISCONNECTING.LINK", 4),

	ARRESTER("DeviceTypeEnum.ARRESTER", 5),

	VOLTAGE_TRANSFORMER("DeviceTypeEnum.VOLTAGE.TRANSFORMER", 6),

	CURRENT_TRANSFORMER("DeviceTypeEnum.CURRENT.TRANSFORMER", 7),

	BUS("DeviceTypeEnum.BUS", 8),

	BUSCOUPLE("DeviceTypeEnum.BUSCOUPLE", 9),

	SWITCH_CUBICLE("DeviceTypeEnum.SWITCH.CUBICLE", 10),

	POWER_CABLE("DeviceTypeEnum.POWER.CABLE", 11),

	LIGHTNING_ROD("DeviceTypeEnum.LIGHTNING.ROD", 12),

	WALL_BUSHING("DeviceTypeEnum.WALL.BUSHING", 13),

	ELECTRIC_REACTOR("DeviceTypeEnum.ELECTRIC.REACTOR", 14),

	ELECTRIC_CONTACT_WIRE("DeviceTypeEnum.ELECTRIC.CONTACT.WIRE", 15),

	POWER_CAPACITOR("DeviceTypeEnum.POWER.CAPACITOR", 16),

	DISCHARGE_COIL("DeviceTypeEnum.DISCHARGE.COIL", 17),

	LOAD_SWITCH("DeviceTypeEnum.LOAD.SWITCH", 18),

	EARTHING_TRANSFORMER("DeviceTypeEnum.EARTHING.TRANSFORMER", 19),

	EARTHINGRESISTOR("DeviceTypeEnum.EARTHINGRESISTOR", 20),

	GROUNDING_GRID("DeviceTypeEnum.GROUNDING.GRID", 21),

	COUPLING_FILTER("DeviceTypeEnum.COUPLING.FILTER", 22),

	ISOLATOR("DeviceTypeEnum.ISOLATOR", 23),

	COUPLING_CONDENSER("DeviceTypeEnum.COUPLING.CONDENSER", 24),

	CABINET("DeviceTypeEnum.CABINET", 25),

	OTHER("DeviceTypeEnum.OTHER", 26),

	FUSE("DeviceTypeEnum.FUSE", 27),

	TRANSFORMER_FOR_SUBSTATIONS("DeviceTypeEnum.TRANSFORMER.FOR.SUBSTATIONS", 28),

	ARC_SUPPRESSING_DEVICE("DeviceTypeEnum.ARC.SUPPRESSING.DEVICE", 29),

	MAIN_TRANSFORMER("DeviceTypeEnum.MAIN.TRANSFORMER", 30),

	TRAP("DeviceTypeEnum.TRAP", 31),

	COMBINED_ELECTRICAL_APPARATUS("DeviceTypeEnum.COMBINED.ELECTRICAL.APPARATUS", 32),

	COMBINED_TRANSFORMER("DeviceTypeEnum.COMBINED.TRANSFORMER", 33);

	/** 设备名 */
	private final String name;
	/** 代码 */
	private final int code;

	DeviceTypeEnum(String name, int code) {
		this.name = name;
		this.code = code;
	}

	/**
	 * 根据name获取ENUM
	 * 
	 * @param name
	 * @return
	 */
	public static DeviceTypeEnum getByName(String name) {
		for (DeviceTypeEnum resultCode : DeviceTypeEnum.values()) {
			if (resultCode.getName().equals(name)) {
				return resultCode;
			}
		}

		return null;
	}

	/**
	 * 根据code获取ENUM
	 * 
	 * @param name
	 * @return
	 */
	public static DeviceTypeEnum getByCode(Integer code) {
		if(code!=null) {
			for (DeviceTypeEnum resultCode : DeviceTypeEnum.values()) {
				if (resultCode.getCode() == code) {
					return resultCode;
				}
			}
		}
		return null;
	}

	public String getName() {
		return name;
	}

	public int getCode() {
		return code;
	}
}
