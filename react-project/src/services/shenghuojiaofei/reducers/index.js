//  引入combineReducers来合并多个reducers为一个主reducers
import { combineReducers } from 'redux'
import app from './app'
import selectOrg from './selectOrg'
import addUser from './addUser'
import billInfo from './billInfo'
import order from './order'

const reducers = combineReducers({ app, selectOrg, addUser, billInfo, order })

export default reducers
