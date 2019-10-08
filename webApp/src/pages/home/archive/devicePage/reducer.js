import {
    ARCHIVE_DEVICE_GET_DEVICE_INFO,
    ARCHIVE_DEVICE_ADD_EDIT_DEVICE_INFO,
    ARCHIVE_DEVICE_DELETE_DEVICE_INFO,
    ARCHIVE_COMMON_TYPE_QUERY_VOLTAGE_LEVEL,
    ARCHIVE_COMMON_TYPE_QUERY_DEVICE_TYPE,
    ARCHIVE_COMMON_TYPE_QUERY_STRUCTURAL_STYLE,
    ARCHIVE_COMMON_TYPE_QUERY_PHASE,
    ARCHIVE_ARCHIVE_GENERATEDEFPOINTS,
} from '../../../../actions/types';

const initialState = {
    success: false,
    data: null,
    dataSource: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    commonTypeVoltageLevel: [],
    commonBayType: [],
    commonTypeDeviceType: [],
    commonStructualStyle: [],
    commonPhase: [],
};

function deviceReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case ARCHIVE_DEVICE_GET_DEVICE_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                dataSource: action.data,
            });
            break;
        case ARCHIVE_DEVICE_ADD_EDIT_DEVICE_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_DEVICE_DELETE_DEVICE_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_COMMON_TYPE_QUERY_VOLTAGE_LEVEL:
            newState = Object.assign({}, state, {
                commonTypeVoltageLevel: action.data,
            });
            break;
        case ARCHIVE_COMMON_TYPE_QUERY_DEVICE_TYPE:
            newState = Object.assign({}, state, {
                commonTypeDeviceType: action.data,
            });
            break;
        case ARCHIVE_COMMON_TYPE_QUERY_STRUCTURAL_STYLE:
            newState = Object.assign({}, state, {
                commonStructualStyle: action.data,
            });
            break;
        case ARCHIVE_COMMON_TYPE_QUERY_PHASE:
            newState = Object.assign({}, state, {
                commonPhase: action.data,
            });
            break;
        case ARCHIVE_ARCHIVE_GENERATEDEFPOINTS:
            newState = Object.assign({}, state, {
                data: action.data,
            });
            break;
        default:
            break;
    }
    return newState;
}

export default deviceReducer;
