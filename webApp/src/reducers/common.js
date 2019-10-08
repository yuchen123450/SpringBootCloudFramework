import { AUTH_CHECK_TOKEN, COMMON_CHANGE_LANGUAGE, COMMON_JUDGVE_MOBILE } from '../actions/types';

const initialState = {
    isMobile: false,
    accredit: false,
    langType: 'en',
    langContent: {},
};

function commonReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case AUTH_CHECK_TOKEN:
            newState = Object.assign({}, state, {
                accredit: action.accredit,
            });
            break;
        case COMMON_CHANGE_LANGUAGE:
            newState = Object.assign({}, state, {
                langType: action.langType,
                langContent: action.langContent,
            });
            break;
        case COMMON_JUDGVE_MOBILE:
            newState = Object.assign({}, state, {
                isMobile: action.data,
            });
            break;
        default:
            break;
    }
    return newState;
}

export default commonReducer;
