import React from 'react'
import { getStore } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { login, get } from 'business'
import customize from 'customize'

class App extends React.Component {
  componentWillMount() {
    login(err => {
      if (err) {
        console.log('login err')
        return
      }
      const userId = getStore('customerUserId', 'session')
      const userPhone = getStore('userPhone', 'session')
      // const url = `/game/v1/url?userId=${ userId }&userPhone=${ userPhone }`
      get('/game/v1/url', { userId, userPhone, channel: 'pingan' }).then(({ code, data, message }) => {
        if (code === 0) {
          window.location.replace(data)
        } else {
          Toast.fial(message)
        }
      })
    })
  }
  render() {
    return <div />
  }
}

export default customize(App)
