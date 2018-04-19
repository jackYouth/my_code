import React from 'react'
// import { browserHistory } from 'react-router'
// import { Icon } from 'antd-mobile'
import { setStore, getStore } from '@boluome/common-lib'
import { Mask, Contact } from '@boluome/oto_saas_web_app_component'

class ContactList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      chooseContact: getStore('coffee_contact', 'session') ? getStore('coffee_contact', 'session') : '',
    }
    // console.log('ContactList-----', props)
    this.handleChooseContact = this.handleChooseContact.bind(this)
  }
  componentWillUnmount() {
    Mask.closeAll()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  // 当选择了收货地址之后的事件
  handleChooseContact(contact) {
    console.log('handleChooseContact----', contact)
    setStore('coffee_contact', contact, 'session')
    setStore('goodsCartarr', [], 'session')
    if (contact) {
      // window.history.back()
      Mask.closeAll()
    }
  }
  render() {
    const { chooseContact = '' } = this.state
    return (
      <div>
        <Contact handleChange={ contact => this.handleChooseContact(contact) }
          hideDefaultBtn='true'
          source='coffee'
          fromWhich='true'
          chooseContact={ chooseContact }
        />
      </div>
    )
  }
}
export default ContactList
