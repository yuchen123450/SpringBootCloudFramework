import { combineReducers } from 'redux';
import common from './common';

import login from '../pages/auth/login/reducer';

//combineReducers 接收一个对象
//可以把所有顶级的 reducer 放到一个独立的文件中，通过 export 暴露出每个 reducer 函数，
//然后使用 import * as reducers 得到一个以它们名字作为 key 的 object
const entire = combineReducers({
    commonReducer: common,
    loginReducer: login,
});

export default entire;
