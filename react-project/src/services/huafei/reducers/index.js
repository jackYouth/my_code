// 引入combineReducers来合并多个reducers为一个主reducers
import { combineReducers } from 'redux'
import huafei from './huafei'

const reducers = combineReducers({ huafei })

export default reducers
