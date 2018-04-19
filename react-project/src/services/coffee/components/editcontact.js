import React from 'react'
// import { browserHistory } from 'react-router'
// import { Toast } from 'antd-mobile'
import { setStore, getStore } from '@boluome/common-lib' // , get
import { ContactForm, Mask } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

class EditContact extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.handleBackgoorder = this.handleBackgoorder.bind(this)
    this.fetchContact = this.fetchContact.bind(this)
  }
  fetchContact(contactId) {
    console.log('---test---')
    const userId = getStore('customerUserId', 'session')
    get('/user/v1/contacts', { userId })
    .then(({ code, data, message }) => {
      if (code === 0) {
        if (data.length !== 0) { // 在外卖中改的，2017-7-06
          for (let i = 0; i < data.length; i++) {
            if (contactId === data[i].contactId) {
              setStore('coffee_contact', data[i], 'session')
              window.history.back()
            }
          }
        }
      } else {
        window.history.back()
        console.log('coffee编辑地址', message)
      }
    })
  }
  handleBackgoorder() {
    const { contactId } = this.state
    console.log(contactId)
    this.fetchContact(contactId)
  }
  componentWillMount() {
    const editContact = getStore('coffee_contact', 'session')
    this.setState({
      editContact,
      contactId: editContact.contactId,
    })
  }
  componentWillUnmount() {
    Mask.closeAll()
  }
  render() {
    const { editContact } = this.state
    console.log('editContact---', editContact)
    return (
      <div className='contacttWrap'>
        <ContactForm { ...{ editContact } } onSuccess={ this.handleBackgoorder } cannotEdit='true' source='coffee' fromWhich='true' />
      </div>
    )
  }
}

export default EditContact
