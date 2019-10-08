//常用颜色
export const COLOR = {
    normal: '#159E54',
    warning: '#FF7A0C',
    alarm: '#FA3E51',
    disabled: '#666',
    standard: '#1890FF',
};

//本地缓存中的关键字
export const LOCALSTORAGE = {
    langType: 'langType',
    langContent: 'langContent',
    token: 'token',
    userName: 'userName',
    activeKey: 'activeKey',
    targetPage: 'targetPage',
    authOperation: 'authOperation',
};

//正则表达式
export const PATTERN = {
    illegal: /[\/\\$*:~!?^<>|"]/,
    password: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[~!@#$%^&*.?])[a-zA-Z\d~!@#$%^&*.?]*$/, ///(?=.*\d)(?=.*[a-zA-Z])./,
    firstOrLastHasBlank: /(^\s)|(\s$)/,
    phoneNumber: /^([0-9]{3,4}-)?[0-9]{7,8}$/, //电话号码
    numberAndPot: /^([0-9]*)+(.[0-9]{1,4})?$/, //^([0-9]*)+(.[0-9]{1,4})?$/,  //只能输入整数或小数(保留小数点后4位)
    numberPotAndNegative: /^[-]?\d*\.?\d{0,4}$/, //^([0-9]*)+(.[0-9]{1,4})?$/,  //只能输入整数或小数或者负数(保留小数点后4位)
    onlyNumber: /^[1-9]\d*$/g, //纯数字
    latitude: /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,6})?)|90(([.][0]{1,6})?))$/, //纬度校验
    longitude: /^-?(([1-9]\d?)|(1[0-7]\d)|180)(\.\d{1,6})?$/, //精度校验
    userName: /^[0-9a-zA-Z\u4E00-\u9FA5\s\.]+$/, //用户名校验
    EngNumUnderLine: /^[\u9fa5_a-zA-Z0-9]+$/, //英文字母和数字及下划线(产品序列号规则),
    empty: /\S/,
    illegalWithOutColon: /[\/\\$*~!?^<>|"]/, //单独检验tagName
    illegalWithOutComma: /[,]/, //校验不能单独带有英文逗号符号
};

//阈值
export const THRESHOLD = {
    TEVMAX: 60, //TEV最大阈值
};

//单位
export const UNITENUM = {
    AIRCONDITIONER_TEMP: 17,
    BATTERY_RECTIFIER_VOLTAGE: 5,
    BATTERY_GROUP_VOLTAGE: 5,
    BATTERY_TESTED_CURRENT: 9,
    WATERLEVEL: 29,
    SF6: 28,
    OXYGEN: 8,
};
