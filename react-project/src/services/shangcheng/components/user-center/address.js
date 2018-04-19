import React from 'react'
import { setStore } from '@boluome/common-lib'
import { Contact } from '@boluome/oto_saas_web_app_component'

export default class Address extends React.Component {
  constructor(props) {
    super(props)
    console.log(props.test)
  }
  handleChange(contact) {
    setStore('scContact', contact, 'session')
  }
  handleContainerClose() {
    window.history.back()
  }
  render() {
    return <Contact handleChange={ this.handleChange } handleContainerClose={ this.handleContainerClose } />
  }
}
