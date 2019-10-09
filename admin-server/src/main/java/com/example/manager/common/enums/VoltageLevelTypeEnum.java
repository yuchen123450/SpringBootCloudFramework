package com.example.manager.common.enums;

public enum VoltageLevelTypeEnum {

  UNKNOW("UNKNOWN", 0),

  AC220V("AC220V", 1),

  AC380V("AC380V", 2),

  AC6KV("AC6kV", 3),

  AC10KV("AC10kV", 4),

  AC35KV("AC35kV", 5),

  AC110KV("AC110kV", 6),

  AC220KV("AC220kV", 7),

  AC330KV("AC330kV", 8),

  AC500KV("AC500kV", 9),

  AC750KV("AC750kV", 10),

  AC1000KV("AC1000kV", 11),

  AC800KV("AC800kV", 12),

  AC20KV("AC20kV", 13),

  AC66KV("AC66kV", 14),

  AC12KV("AC12kV", 15);



  /** 设备名. */
  private final String name;
  /** 代码. */
  private final int code;

  VoltageLevelTypeEnum(String name, int code) {
    this.name = name;
    this.code = code;
  }

  /**
   * 根据name获取ENUM.
   * 
   * @param name 电压等级名称
   * @return 枚举
   */
  public static VoltageLevelTypeEnum getByName(String name) {
    for (VoltageLevelTypeEnum resultCode : values()) {
      if (resultCode.getName().equals(name)) {
        return resultCode;
      }
    }

    return null;
  }

  /**
   * 根据code获取ENUM.
   * 
   * @param code 代号
   * @return 枚举
   */
  public static VoltageLevelTypeEnum getByCode(int code) {
    for (VoltageLevelTypeEnum resultCode : values()) {
      if (resultCode.getCode() == code) {
        return resultCode;
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
