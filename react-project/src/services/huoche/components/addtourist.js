import React from 'react'
import { List, Icon, Toast } from 'antd-mobile'
import { SlidePage, Mask, Tourist } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'

import '../style/addtourist.scss'

import AddPeople from './AddPeople.js'

import add from '../img/add.svg'

const Item = List.Item

class AddTouristCom extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    this.state = {
      close: false,
      // touristNumer: [], // 蠢了
      ...props,
    }
    this.handleTouristList = this.handleTouristList.bind(this)
    // this.handleFormSuccess = this.handleFormSuccess.bind(this)
    // this.handleAddTourist = this.handleAddTourist.bind(this)
    // this.handleDeleteTourist = this.handleDeleteTourist.bind(this)
  }
  componentWillUnmount() {
    // Popup.hide()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  // 获取到
  handleTouristNumer(checkedArr) {
    const { changeTouristNumer } = this.props
    this.setState({
      touristNumer: checkedArr,
    })
    console.log('--handleTouristNumer---', checkedArr)
    changeTouristNumer(checkedArr)
    setStore('TOURISTNUMBER', checkedArr, 'session')
    if (checkedArr && checkedArr.length === 1) {
      if (checkedArr[0].type === 2 || checkedArr[0].type === 3) {
        Toast.info('请至少选择一个成人', 2)
      }
    }
    console.log('TOURISTNUMBER-111-', checkedArr)
  }
  handleTouristList() {
    const { touristNumer } = this.state
    Mask(
      <SlidePage target='right' type='root' showClose={ false } >
        <Tourist
          checkedArr={ touristNumer }
          handleChange={ contact => this.handleTouristNumer(contact) }
          Multiplesel='true'
          numberSum={ 5 }
        />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  // handleFormSuccess(contact) {
  //   const { touristNumer } = this.state
  //   for (let i = 0; i < touristNumer.length; i++) {
  //     if (touristNumer[i].id === contact.id) {
  //       touristNumer[i] = contact
  //     }
  //   }
  //   this.setState({
  //     touristNumer,
  //   })
  //   setStore('TOURISTNUMBER', touristNumer, 'session')
  // }
  // handleAddTourist(item) {
  //   Mask(
  //     <SlidePage target='right' type='root' >
  //       <Addtourist { ...{ editContact: item } } onSuccess={ contact => this.handleFormSuccess(contact) } />
  //     </SlidePage>
  //     , { mask: false, style: { position: 'absolute' } }
  //   )
  // }
  // 删除购票的某个人
  // handleDeleteTourist(contact) {
  //   const { handleChangeTourNum } = this.props
  //   const { touristNumer } = this.state
  //   for (let i = 0; i < touristNumer.length; i++) {
  //     if (touristNumer[i].id === contact.id) {
  //       touristNumer.splice(i, 1)
  //     }
  //   }
  //   this.setState({
  //     touristNumer,
  //   })
  //   setStore('TOURISTNUMBER', touristNumer, 'session')
  //   handleChangeTourNum(touristNumer)
  // }
  render() {
    const { touristNumer } = this.state
    const { handleChangeTourNum } = this.props
    // console.log('1111----', touristNumer)
    if (touristNumer && touristNumer.length > 0) {
      return (
        <div className='addtourist'>
          <List>
            {
              touristNumer.map((item, index) => (
                <AddPeople key={ `${ item && item.id ? item.id : index }` } peopleData={ item } touristNumer={ touristNumer } handleChangeTourNum={ handleChangeTourNum } />
              ))
            }
          </List>
          <List>
            <Item>
              <div className='addrBtn' onClick={ () => { this.handleTouristList() } }>
                <Icon type={ add } /> 添加乘客
              </div>
            </Item>
          </List>
        </div>
      )
    }
    return (
      <List>
        <Item>
          <div className='addrBtn' onClick={ () => { this.handleTouristList() } }>
            <Icon type={ add } /> 添加乘客
          </div>
        </Item>
      </List>
    )
  }
}

export default AddTouristCom
