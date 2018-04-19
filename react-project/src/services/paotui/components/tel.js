import React from 'react'
import { InputItem, Icon } from 'antd-mobile'
// import { Mask } from '@boluome/oto_saas_web_app_component'

import telpic from '../img/tel.svg'
import people from '../img/people.svg'

class Tel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
  }
  componentWillReceiveProps(nextProps) {
    // console.log('tel---', nextProps)
    this.setState({
      ...nextProps,
    })
  }
  render() {
    const { contact, handleChangePhone, handleChangeName } = this.state
    // console.log(contact)
    const { name, phone } = contact
    return (
      <div className='tel'>
        <InputItem
          className='peopleInt'
          placeholder='收货人...'
          defaultValue={ name }
          value={ name }
          onChange={ v => handleChangeName(v, contact) }
        ><Icon type={ people } /></InputItem>
        <InputItem
          className='telInt'
          type='phone'
          maxLength={ 11 }
          placeholder='手机号...'
          defaultValue={ phone }
          value={ phone }
          onChange={ v => handleChangePhone(v, contact) }
        ><Icon type={ telpic } /></InputItem>
      </div>
    )
  }
}

export default Tel
