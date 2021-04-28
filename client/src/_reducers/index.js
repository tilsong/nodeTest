import { combineReducers } from 'redux'; //store와 함께 리듀서들이 여럿 있을 수 있다.
//어떻게 리듀스 안에서 state가 변하는지 보고 마지막으로 변한것을 보여주는 것이므로 리듀서가 다 나누어져 있는 것이다.
//그리고 이러한 기능들을 combineReducers를 이용헤서 Root Reducer에서 하나로 합쳐지는 것이다.
//import user from './user_reducer';

const rootReducer = combineReducers({//기능이 많아질수록 늘어날 것
    //user,
})

export default rootReducer;