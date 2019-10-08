import { ARCHIVE_REGOIN_GET_REGION_INFO } from '../../../../actions/types';

const initialState = {
    success: false,
    dataSource: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
};

function regionManagementReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case ARCHIVE_REGOIN_GET_REGION_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                dataSource: action.data,
            });
            break;
        default:
            break;
    }
    return newState;
}

export default regionManagementReducer;
