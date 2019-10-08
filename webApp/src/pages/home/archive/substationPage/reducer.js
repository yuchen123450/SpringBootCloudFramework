import {
    ARCHIVE_SUBSTATION_GET_SUBSTATION_INFO,
    ARCHIVE_SUBSTATION_DELETE_SUBSTATION_INFO,
    ARCHIVE_SUBSTATION_ADD_EDIT_SUBSTATION_INFO,
    ARCHIVE_COMMON_TYPE_QUERY_VOLTAGE_LEVEL,
    ARCHIVE_SUBSTATION_UPLOAD_SUBSTATION_INFO,
} from '../../../../actions/types';

const initialState = {
    success: false,
    data: null,
    substationDataSource: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    commonTypeVoltageLevel: [],
    uploadResult: '',
};

function substationReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case ARCHIVE_SUBSTATION_GET_SUBSTATION_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                substationDataSource: action.data,
            });
            break;
        case ARCHIVE_SUBSTATION_ADD_EDIT_SUBSTATION_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case ARCHIVE_SUBSTATION_DELETE_SUBSTATION_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case ARCHIVE_COMMON_TYPE_QUERY_VOLTAGE_LEVEL:
            newState = Object.assign({}, state, {
                commonTypeVoltageLevel: action.data,
            });
            break;
        case ARCHIVE_SUBSTATION_UPLOAD_SUBSTATION_INFO:
            newState = Object.assign({}, state, {
                uploadResult: action.data,
            });
            break;
        default:
            break;
    }
    return newState;
}

export default substationReducer;
