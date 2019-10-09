package com.example.manager.common.enums;

/**
 * 单位枚举
 * 
 * @author Yanfa-0509
 * @date 2017年8月15日 下午4:50:01
 * @Title BandwidthEnum @Description：
 */
public enum UnitEnum {

	unknown("unknown", 0x00), 
	decibel("dB", 0x01), 
	Decibel_milliwatt("dBm", 0x02), 
	Decibel_milliVolt("dBmV", 0x03), 
	Decibel_microwatt("dBμV", 0x04), 
	Volt("V", 0x05), 
	MilliVolt("mV", 0x06), 
	MicroVolt("μV", 0x07), 
	Persent("%", 0x08), 
	Ampere("A", 0x09), 
	MilliAmpere("mA", 0x0A), 
	MicroAmpere("μA", 0x0B), 
	Omega("Ω", 0x0C), 
	MilliOmega("mΩ", 0x0D), 
	MicroOmega("μΩ", 0x0E), 
	Acceleration("m/s²", 0x0F), 
	Millimeter("mm", 0x10), 
	Celsius("℃", 0x11), 
	Fahrenheit("℉", 0x12), 
	Pascal("Pa", 0x13), 
	Coulomb("C", 0x14), 
	MilliCoulomb("mC", 0x15), 
	MicroCoulomb("μC", 0x16), 
	NanoCoulomb("nC", 0x17), 
	OicoCoulomb("pC", 0x18), 
	KiloVolt("kV", 0x19);

	/**
	 * 单位符号.
	 */
	private final String name;
	/**
	 * 单位代号.
	 */
	private final int code;

	private UnitEnum(String name, int code) {
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
	 * 根据单位符号（unitSymbol）获取ENUM.
	 * 
	 * @param unitSymbol
	 *            单位名称
	 * @return UnitEnum
	 */
	public static UnitEnum getByUnitSymbol(String unitSymbol) {
		for (UnitEnum resultCode : UnitEnum.values()) {
			if (resultCode.getName().equals(unitSymbol)) {
				return resultCode;
			}
		}

		return null;
	}

	/**
	 * 根据单位代号（code）获取ENUM.
	 * 
	 * @param code
	 *            代号
	 * @return UnitEnum
	 */
	public static UnitEnum getByCode(int code) {
		for (UnitEnum resultCode : UnitEnum.values()) {
			if (resultCode.getCode() == code) {
				return resultCode;
			}
		}

		return null;
	}
}
