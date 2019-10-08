import {
    ARCHIVE_COMPANY_GET_COMPANY_INFO,
    ARCHIVE_COMPANY_ADD_EDIT_COMPANY_INFO,
    ARCHIVE_COMPANY_DELETE_COMPANY_INFO,
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
};

function companyReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case ARCHIVE_COMPANY_GET_COMPANY_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                dataSource: action.data,
            });
            break;
        case ARCHIVE_COMPANY_ADD_EDIT_COMPANY_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case ARCHIVE_COMPANY_DELETE_COMPANY_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        default:
            break;
    }
    return newState;
}

export default companyReducer;
