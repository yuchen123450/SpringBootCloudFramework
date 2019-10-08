import {
    ARCHIVE_TESTPOINT_GET_TESTPOINT_INFO,
    ARCHIVE_TESTPOINT_ADD_EDIT_TESTPOINT_INFO,
    ARCHIVE_TESTPOINT_DELETE_TESTPOINT_INFO,
    ARCHIVE_COMMON_TYPE_GET_VOLTAGE_CLASS,
    ARCHIVE_COMMON_TYPE_GET_DEVICE_TYPES,
    ARCHIVE_COMMON_TYPE_QUERY_CHANNEL_TYPE,
    ARCHIVE_COMMON_TYPE_QUERY_SENSOR_TYPE,
    SYSTEM_ALARM_LEVEL_CUSTOM,
    ARCHIVE_SINGLE_THRESHOLD_ADD,
    ARCHIVE_SINGLE_THRESHOLD_QUERY,
    ARCHIVE_THRESHOLD_UPDATE,
    ARCHIVE_THRESHOLD_DELETE,
    ARCHIVE_TESTPOINT_RULE,
    ARCHIVE_TESTPOINT_RULE_ADD,
    ARCHIVE_TESTPOINT_RULE_DELETE,
    ARCHIVE_TESTPOINT_RULE_UPDATE,
    ARCHIVE_RULES_AE,
    ARCHIVE_RULES_AE_ADD,
    ARCHIVE_RULES_AE_DELETE,
    ARCHIVE_RULES_AE_UPDATE,
} from '../../../../actions/types';

const initialState = {
    success: false,
    testPoints: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    deviceTypeList: [],
    voltageLevelList: [],
    channelTypeList: [],
    testPointTypeList: [],
    alarmResult: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    tevThreshold: [],
    tevTestpointRules: [],
    aeThreshold: [],
    aeTestpointRules: [],
};

function testpointReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case ARCHIVE_TESTPOINT_GET_TESTPOINT_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                testPoints: action.data,
            });
            break;
        case ARCHIVE_TESTPOINT_ADD_EDIT_TESTPOINT_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_TESTPOINT_DELETE_TESTPOINT_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_COMMON_TYPE_GET_VOLTAGE_CLASS:
            newState = Object.assign({}, state, {
                voltageClassList: action.data,
            });
            break;
        case ARCHIVE_COMMON_TYPE_GET_DEVICE_TYPES:
            newState = Object.assign({}, state, {
                deviceTypeList: action.data,
            });
            break;
        case ARCHIVE_COMMON_TYPE_QUERY_CHANNEL_TYPE:
            newState = Object.assign({}, state, {
                channelTypeList: action.data,
            });
            break;
        case ARCHIVE_COMMON_TYPE_QUERY_SENSOR_TYPE:
            newState = Object.assign({}, state, {
                testPointTypeList: action.data,
            });
            break;
        case SYSTEM_ALARM_LEVEL_CUSTOM:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                alarmResult: action.data,
            });
            break;
        case ARCHIVE_SINGLE_THRESHOLD_ADD:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_SINGLE_THRESHOLD_QUERY:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                tevThreshold: action.data,
            });
            break;
        case ARCHIVE_THRESHOLD_UPDATE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_THRESHOLD_DELETE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_TESTPOINT_RULE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                tevTestpointRules: action.data,
            });
            break;
        case ARCHIVE_TESTPOINT_RULE_ADD:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_TESTPOINT_RULE_DELETE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_TESTPOINT_RULE_UPDATE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_RULES_AE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                aeThreshold: action.data,
            });
            break;
        case ARCHIVE_RULES_AE_ADD:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_RULES_AE_DELETE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_RULES_AE_UPDATE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        default:
            break;
    }
    return newState;
}

export default testpointReducer;
