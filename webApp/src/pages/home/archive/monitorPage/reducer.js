import {
    ARCHIVE_SENSOR_INFO,
    ARCHIVE_SENSOR_HOST_INFO,
    ARCHIVE_SENSOR_UPDATE_MONITOR_VALID,
    ARCHIVE_SENSOR_COLLECT_DATA_ISSUED,
    ARCHIVE_SENSOR_MONITOR_GET_STATUS,
} from '../../../../actions/types';

const initialState = {
    success: false,
    dataSource: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    dataHostSource: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
};

function sensorManagementReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case ARCHIVE_SENSOR_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                dataSource: action.data,
            });
            break;
        case ARCHIVE_SENSOR_HOST_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                dataHostSource: action.data,
            });
            break;
        case ARCHIVE_SENSOR_UPDATE_MONITOR_VALID:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_SENSOR_COLLECT_DATA_ISSUED:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_SENSOR_MONITOR_GET_STATUS:
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

export default sensorManagementReducer;
