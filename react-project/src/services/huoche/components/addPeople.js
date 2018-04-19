import React from 'react'
import { Icon } from 'antd-mobile'
import { SlidePage, Mask, Addtourist } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'

import '../style/addtourist.scss'
// import deleteIcon from '../img/delete.png'

// const Item = List.Item
// const Brief = Item.Brief

class AddPeople extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      bool: false,
    }
    // this.handleTouristList = this.handleTouristList.bind(this)
    this.handleFormSuccess = this.handleFormSuccess.bind(this)
    this.handleAddTourist = this.handleAddTourist.bind(this)
    this.handleDeleteTourist = this.handleDeleteTourist.bind(this)
  }
  componentWillUnmount() {
    // Popup.hide()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  handleFormSuccess(contact) {
    const { touristNumer } = this.state
    for (let i = 0; i < touristNumer.length; i++) {
      if (touristNumer[i].id === contact.id) {
        touristNumer[i] = contact
      }
    }
    this.setState({
      touristNumer,
    })
    setStore('TOURISTNUMBER', touristNumer, 'session')
  }
  handleAddTourist(item) {
    Mask(
      <SlidePage target='right' type='root' showClose={ false }>
        <Addtourist { ...{ editContact: item } } onSuccess={ contact => this.handleFormSuccess(contact) } />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  // 撤销删除
  handleSwitch() {
    const { bool } = this.state
    this.setState({ bool: !bool })
  }
  // 选择时候删除购票人
  handleChooseDelete(idCard) {
    console.log(idCard)
    this.setState({
      bool: true,
    })
  }
  // 确定---删除购票的某个人
  handleDeleteTourist(contact) {
    const { handleChangeTourNum } = this.props
    const { touristNumer } = this.state
    for (let i = 0; i < touristNumer.length; i++) {
      if (touristNumer[i].id === contact.id) {
        touristNumer.splice(i, 1)
      }
    }
    this.setState({
      touristNumer,
    })
    setStore('TOURISTNUMBER', touristNumer, 'session')
    handleChangeTourNum(touristNumer)
  }
  render() {
    // const { peopleData } = this.props
    const { peopleData, bool } = this.state
    console.log('hkasjdksjdkd', peopleData)
    const { idCard, name, type, id } = peopleData
    let people = '成人票'
    if (type === 2) {
      people = '儿童票'
    } else if (type === 3) {
      people = '婴儿票'
    }
    return (
      <div className='passenger_list' onClick={ () => { if (bool) { this.handleSwitch() } } } key={ idCard + id }>
        <div className='passenger_icon' style={ bool ? { width: '0rem' } : {} } >
          <Icon type={ require('svg/jipiao/deletbtn.svg') } onClick={ () => { this.handleSwitch() } } />
        </div>
        <div className='passenger_main' style={ bool ? { paddingLeft: '0.3rem' } : {} } onClick={ () => { if (!bool) { this.handleAddTourist(peopleData) } } }>
          <p><span>{ name }</span>{ people }</p>
          <p>身份证{ idCard }</p>
        </div>
        <div onClick={ () => { this.handleAddTourist(peopleData) } }
          className='passenger_jump' style={ bool ? { width: '0rem' } : {} }
        >
          <Icon type={ require('svg/jipiao/arrowRight.svg') } />
        </div>
        <div className='passenger_delet' style={ bool ? {} : { width: '0rem' } }
          onClick={ () => { this.handleDeleteTourist(peopleData) } }
        >
          <span>删除</span>
        </div>
      </div>
    )
  }
}

// return (
//   <div className='wrap'>
//     <Item className='tourist'
//       key={ `${ id + idCard }` }
//       arrow={ `${ bool ? '删除' : 'horizontal' }` }
//       onClick={ () => { if (bool) { this.handleSwitch() } } }
//       thumb={ <div className='checkedDelete' onClick={ () => { this.handleChooseDelete(idCard) } }><img src={ deleteIcon } alt='' /></div> }
//       multipleLine
//     >
//       <div onClick={ () => { if (!bool) { this.handleAddTourist(peopleData) } } }>{ name }</div>
//       <Brief><div onClick={ () => { if (!bool) { this.handleAddTourist(peopleData) } } }>身份证 { idCard }</div></Brief>
//       <div className='checkedGoEdit' onClick={ () => { if (!bool) { this.handleAddTourist(peopleData) } } } />
//     </Item>
//   </div>
// )

// <div className='deteleBtn' onClick={ () => { this.handleDeleteTourist(peopleData) } }>删除</div>

export default AddPeople
