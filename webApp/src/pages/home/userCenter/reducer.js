import {
    SYSTEM_RECORD_GROUP_GET_RECORD_GROUP,
    SYSTEM_USER_GROUP_GET_USER_GROUP,
    SYSTEM_USER_GET_USER_INFO,
    SYSTEM_USER_GROUP_DELETE_USER_GROUP,
    SYSTEM_USER_ADD_USER_INFO,
    SYSTEM_USER_GROUP_UPDATE_USER_GROUP,
    SYSTEM_RECORD_GROUP_UPDATE_RECORD_GROUP,
    SYSTEM_RECORD_GROUP_DELETE_RECORD_GROUP,
    SYSTEM_USER_GROUP_ADD_USER_GROUP,
    SYSTEM_USER_UPDATE_USER_INFO,
    SYSTEM_USER_DELETE_USER_INFO,
    SYSTEM_GET_SYS_MENU,
    SYSTEM_RECORD_GROUP_GET_RECORD_GROUP_BY_ID,
    SYSTEM_USER_GROUP_GET_USER_GROUP_MENUS,
    SYSTEM_USER_GROUP_GET_USER_GROUP_BY_COMPANY,
    SYSTEM_RECORD_GROUP_GET_RECORD_INFO_BY_COMPANY_ID,
    SYSTEM_USER_MODIFY_PASSWORD,
    SYSTEM_USER_GROUP_SEARCH_USER_GROUP,
    SYSTEM_RECORD_GROUP_QUERY_RECORD_GROUP,
    SYSTEM_USER_PASSWORD_RESET,
    SYSTEM_USER_GROUP_USERMENU,
    SYSTEM_GET_USERGROUP_BY_COMPANYID,
    SYSTEM_USER_AUTHORITY_SET,
} from '../../../actions/types';

const initialState = {
    success: false,
    data: [],
    systemMenus: [],
    userGroupMenus: [],
    userCompanyGroups: [],
    userDataPermission: [],
    queryUserDataByID: [],
    userDataSource: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    userGroupDataSource: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    dataRecordSource: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    searchUserGroupSource: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    searchDataGroupSource: {
        list: [],
        pageNo: 1,
        totalPage: 1,
        totalRecords: 0,
    },
    useDefaultRoles: [],
};

function userCenterReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case SYSTEM_RECORD_GROUP_GET_RECORD_GROUP:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                dataRecordSource: action.data,
            });
            break;
        case SYSTEM_USER_GROUP_GET_USER_GROUP:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                userGroupDataSource: action.data,
            });
            break;
        case SYSTEM_USER_GET_USER_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                userDataSource: action.data,
            });
            break;
        case SYSTEM_USER_GROUP_DELETE_USER_GROUP:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_USER_ADD_USER_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_USER_GROUP_UPDATE_USER_GROUP:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_RECORD_GROUP_UPDATE_RECORD_GROUP:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_RECORD_GROUP_DELETE_RECORD_GROUP:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_USER_GROUP_ADD_USER_GROUP:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_USER_UPDATE_USER_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_USER_DELETE_USER_INFO:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_GET_SYS_MENU:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                systemMenus: action.data,
            });
            break;
        case SYSTEM_RECORD_GROUP_GET_RECORD_GROUP_BY_ID:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                queryUserDataByID: action.data,
            });
            break;
        case SYSTEM_USER_GROUP_GET_USER_GROUP_MENUS:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                userGroupMenus: action.data,
            });
            break;
        case SYSTEM_USER_GROUP_GET_USER_GROUP_BY_COMPANY:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                userCompanyGroups: action.data,
            });
            break;
        case SYSTEM_RECORD_GROUP_GET_RECORD_INFO_BY_COMPANY_ID:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                userDataPermission: action.data,
            });
            break;
        case SYSTEM_USER_MODIFY_PASSWORD:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_USER_GROUP_SEARCH_USER_GROUP:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                searchUserGroupSource: action.data,
            });
            break;
        case SYSTEM_RECORD_GROUP_QUERY_RECORD_GROUP:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                searchDataGroupSource: action.data,
            });
            break;
        case SYSTEM_USER_PASSWORD_RESET:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_USER_GROUP_USERMENU:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                data: action.data,
            });
            break;
        case SYSTEM_GET_USERGROUP_BY_COMPANYID:
            newState = Object.assign({}, state, {
                type: action.type,
                success: action.success,
                useDefaultRoles: action.data,
            });
            break;
        case SYSTEM_USER_AUTHORITY_SET:
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
export default userCenterReducer;
