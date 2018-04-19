import React from 'react'
import ReactDOM from 'react-dom'
import { setServerUrl, api, get, send, setStore, getStore, removeStore } from '@boluome/common-lib'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import Routes from './routes'
import reducer from './reducers'
import './components/css/index.scss'

const host         = location.host
// let store = createStore(reducer, applyMiddleware(thunk))
let customerCode = host.replace(/(.test.otosaas.com|.otosaas.com)/, '')
// console.log('store============',store);

setServerUrl(/192.168.|localhost/.test(location.hostname)
                ? 'https://dev-api.otosaas.com'
                : `${location.origin}/api`)

// setStore('customerUserId', 'test_long', 'session')

// setStore('customerUserPhone' , '15214387213' , 'session')


// login(customerCode, () => {})

// const Container = () => (
//   <Provider store={ store }>
//     { Routes }
//   </Provider>
// )

const Container = () => (
  <div style={{height:'100%'}}>
    { Routes }
  </div>
)

ReactDOM.render(<Container />, document.getElementById('root'));
