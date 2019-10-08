import {
    STATISTICS_SUMMARY,
    STATISTICS_SSD_TASKSTATUS,
    STATISTIC_TEST_POINT_STATUS,
    STATISTICS_SSD_TASKCALENDAR,
    STATISTICS_SSD_SUBSTATIONSTATUS,
    STATISTICS_DEVICESTATUS,
    STATISTICS_PERSONAL_INFORMATION,
    STATISTICS_STATUS_SUBSTATION,
    STATISTICS_ABNORMALRATIO_SUBSTATION,
    STATISTICS_ABNORMALRATIO_DEVICE,
    STATISTICS_STATUS_SUBSTATIONBYCOMPANY,
    STATISTICS_ABNORMALPROCESS_DEVICE,
    STATISTICS_ALARMINFO_SUBSTATION,
    STATISTICS_ALARMINFO_DEVICE,
    STATISTICS_ALARMINFO_POINT,
    STATISTICS_SSD_MONITOR_AND_ADU,
    STATISTICS_TASK_RESULT,
    STATISTICS_FAILURE_CASE,
    STATISTICS_SSD_DEVICE_INFO,
    STATISTICS_TASK_DEVICE_STATUS_BY_DEVICE_TYPE,
} from '../../actions/types';

const initialState = {
    summary: {
        substationCount: 0,
        deviceCount: 0,
        testpointCount: 0,
        taskCount: 0,
    },
    taskStatus: {},
    testPointStatus: {},
    taskDate: {},
    substationStatus: {}, //站状态详细信息
    substationStatusStatistics: {}, //站状态统计
    deviceStatus: {}, //设备状态信息
    personalInfo: {
        task: {},
    },
    abnormalRatioSubtation: [],
    abnormalRatioDevice: [],
    statusSubstationByCompany: [],
    abnormalProcessDevice: [],

    alarmInfoSubstations: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    alarmInfoDevices: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    alarmInfoPoints: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    monitorAndAdu: {
        monitor: {
            totalCount: 0,
            onlineCount: 0,
            onlineRatio: 0,
            abnormalCount: 0,
            abnormalRatio: 0,
        },
        adu: {
            totalCount: 0,
            onlineCount: 0,
            onlineRatio: 0,
            abnormalCount: 0,
            abnormalRatio: 0,
        },
    },
    taskResult: {},
    failureCaseStatistic: {},
    ssdDeviceInfo: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    deviceStatusByDevTypeData: {},
};

function statisticsReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case STATISTICS_SUMMARY:
            newState = Object.assign({}, state, {
                summary: action.data,
            });
            break;
        case STATISTICS_SSD_TASKSTATUS:
            newState = Object.assign({}, state, {
                taskStatus: action.data,
            });
            break;
        case STATISTIC_TEST_POINT_STATUS:
            newState = Object.assign({}, state, {
                testPointStatus: action.data,
            });
            break;
        case STATISTICS_SSD_TASKCALENDAR:
            newState = Object.assign({}, state, {
                taskDate: action.data,
            });
            break;
        case STATISTICS_SSD_SUBSTATIONSTATUS:
            newState = Object.assign({}, state, {
                substationStatus: action.data,
            });
            break;
        case STATISTICS_DEVICESTATUS:
            newState = Object.assign({}, state, {
                deviceStatus: action.data,
            });
            break;
        case STATISTICS_PERSONAL_INFORMATION:
            newState = Object.assign({}, state, {
                personalInfo: action.data,
            });
            break;
        case STATISTICS_STATUS_SUBSTATION:
            newState = Object.assign({}, state, {
                substationStatusStatistics: action.data,
            });
            break;
        case STATISTICS_ABNORMALRATIO_SUBSTATION:
            newState = Object.assign({}, state, {
                abnormalRatioSubtation: action.data,
            });
            break;
        case STATISTICS_ABNORMALRATIO_DEVICE:
            newState = Object.assign({}, state, {
                abnormalRatioDevice: action.data,
            });
            break;
        case STATISTICS_STATUS_SUBSTATIONBYCOMPANY:
            newState = Object.assign({}, state, {
                statusSubstationByCompany: action.data,
            });
            break;
        case STATISTICS_ABNORMALPROCESS_DEVICE:
            newState = Object.assign({}, state, {
                abnormalProcessDevice: action.data,
            });
            break;

        case STATISTICS_ALARMINFO_SUBSTATION:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                alarmInfoSubstations: action.data,
            });
            break;
        case STATISTICS_ALARMINFO_DEVICE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                alarmInfoDevices: action.data,
            });
            break;
        case STATISTICS_ALARMINFO_POINT:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                alarmInfoPoints: action.data,
            });
            break;
        case STATISTICS_SSD_MONITOR_AND_ADU:
            newState = Object.assign({}, state, {
                monitorAndAdu: action.data,
            });
            break;
        case STATISTICS_TASK_RESULT:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                taskResult: action.data,
            });
            break;
        case STATISTICS_FAILURE_CASE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                failureCaseStatistic: action.data,
            });
            break;
        case STATISTICS_SSD_DEVICE_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                ssdDeviceInfo: action.data,
            });
            break;
        case STATISTICS_TASK_DEVICE_STATUS_BY_DEVICE_TYPE:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                deviceStatusByDevTypeData: action.data,
            });
            break;
        default:
            break;
    }
    return newState;
}

export default statisticsReducer;
