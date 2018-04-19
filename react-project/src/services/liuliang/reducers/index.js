// 引入combineReducers来合并多个reducers为一个主reducers
import { combineReducers } from 'redux'
import liuliang from './liuliang'

const reducers = combineReducers({ liuliang })
export default reducers
