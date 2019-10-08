import {
    ARCHIVE_BAY_GET_BAY_INFO,
    ARCHIVE_BAY_ADD_EDIT_BAY_INFO,
    ARCHIVE_BAY_DELETE_BAY_INFO,
    ARCHIVE_COMMON_TYPE_QUERY_VOLTAGE_LEVEL,
    ARCHIVE_COMMON_TYPE_QUERY_BAY_TYPE,
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
};

function bayReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case ARCHIVE_BAY_GET_BAY_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                dataSource: action.data,
            });
            break;
        case ARCHIVE_BAY_ADD_EDIT_BAY_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
            });
            break;
        case ARCHIVE_BAY_DELETE_BAY_INFO:
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
        case ARCHIVE_COMMON_TYPE_QUERY_BAY_TYPE:
            newState = Object.assign({}, state, {
                commonBayType: action.data,
            });
            break;
        default:
            break;
    }
    return newState;
}

export default bayReducer;
