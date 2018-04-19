import React from 'react'
import { setStore, getStore } from '@boluome/common-lib'
import { login } from 'business'
import customize from 'customize'

class App extends React.Component {
  componentWillMount() {
    document.body.style.display = 'none'
    login(err => {
      if (err) {
        console.log('login err')
        return
      }
      const customerUserId = getStore('customerUserId', 'session')
      const customerUserPhone = getStore('userPhone', 'session')
      setStore('customerUserId', customerUserId)
      setStore('customerUserPhone', customerUserPhone)
      const { location } = window
      const service = location.pathname.split('/')[2]
      location.replace(`${ location.origin }/${ service }?customerUserId=${ customerUserId }&customerUserPhone=${ customerUserPhone }`)
    })
  }
  render() {
    return <div />
  }
}

export default customize(App)
