import React from 'react'
// import { browserHistory } from 'react-router'
// import { Toast } from 'antd-mobile'
import { setStore } from '@boluome/common-lib'
import { Contact, SlidePage } from '@boluome/oto_saas_web_app_component'

// const alert = Modal.alert
class ContactList extends React.Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   pricearr: [],
    // }
    this.handleChangeContactFn = this.handleChangeContactFn.bind(this)
  }
  handleChangeContactFn(contact) {
    setStore('Choosecontact', contact, 'session')
    // dispatch(handleChangeContact(contact, sum))
    window.history.back()
  }
  componentWillUnmount() {
    SlidePage.closeAll()
  }
  render() {
    return (
      <div className='addtouristWrap'>
        <Contact handleChange={ contacts => this.handleChangeContactFn(contacts) } />
      </div>
    )
  }
}

export default ContactList
