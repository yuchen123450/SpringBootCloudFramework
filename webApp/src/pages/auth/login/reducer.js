import { AUTH_LOGIN } from '../../../actions/types';

const initialState = {
    success: false,
};

function loginReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case AUTH_LOGIN:
            newState = Object.assign({}, state, {
                success: action.success,
            });
            break;
        default:
            break;
    }
    return newState;
}

export default loginReducer;
