import React from 'react'
import { browserHistory } from 'react-router'
import { Mask, SlidePage, Contact, NewPromotion } from '@boluome/oto_saas_web_app_component'
// import { List, WhiteSpace, InputItem, Modal, Icon } from 'antd-mobile'
import { Icon, List, InputItem, WhiteSpace } from 'antd-mobile'
import '../style/order.scss'
import bg from '../img/bg.png'

const Item = List.Item

const Order = order => {
  console.log(order)
  const {
    channel,
    contact,
    activity,
    event,
    ticket,
    num,
    fee = 0,
    receivingArr,
    receivingStyle,
    receName,
    recePhone,
    curDiscountData,
    handleChangeName,
    handleChangePhone,
    handleCur,
    handleChangecontact,
    handleChangereceivingStyle,
    handleSubmit,
  } = order
  if (event) {
    return (
      <div className='order'>
        <div className='orderwrap'>
          <Oderdetl event={ event } ticket={ ticket } num={ num } />
          <div className='borderimg' style={{ backgroundImage: `url(${ bg })` }} />
          <WhiteSpace size='lg' />
          <List>
            <Item
              arrow='horizontal'
              extra={ `${ activity.venuesName }` }
              onClick={ () => { browserHistory.push(`/piaowu/addr?addrTitlename=${ activity.venuesName }&addrnameStr=${ activity.venuesAddr }`) } }
            >
              演出地址：
            </Item>
          </List>
          <WhiteSpace size='lg' />
          { receivingArr.length > 1 && <div className='recev_sel'>
            { receivingArr.some(e => e === 1) && <span onClick={ () => handleChangereceivingStyle(1) } className={ receivingStyle === 1 ? 'seling' : '' }>快递配送</span> }
            { receivingArr.some(e => e === 2) && <span onClick={ () => handleChangereceivingStyle(2) } className={ receivingStyle === 2 ? 'seling' : '' }>上门自取</span> }
            { receivingArr.some(e => e === 3) && <span onClick={ () => handleChangereceivingStyle(3) } className={ receivingStyle === 3 ? 'seling' : '' }>现场取票</span> }
            { receivingArr.some(e => e === 4) && <span onClick={ () => handleChangereceivingStyle(4) } className={ receivingStyle === 4 ? 'seling' : '' }>电子票</span> }
          </div> }
          <div>
            { receivingStyle === 1 && <Continfo fee={ fee } contact={ contact } handleChangecontact={ handleChangecontact } /> }
            { receivingStyle === 2 && <div className='smzq'>
              <List>
                <InputItem
                  placeholder={ '请输入取票人姓名' }
                  value={ receName }
                  onChange={ e => { handleChangeName(e) } }
                >取票人姓名</InputItem>
                <InputItem
                  placeholder={ '请输入取票人手机号' }
                  maxLength={ 11 }
                  value={ recePhone }
                  onChange={ e => { handleChangePhone(e) } }
                >取票人手机号</InputItem>
              </List>
              <p>自取地址：{ event.smzqAddress }</p>
              <p>自取时间：{ event.smzqTime }</p>
              <p>{ event.smzqMessage }</p>
            </div> }
            { receivingStyle === 3 && <List>
              <InputItem
                placeholder={ '请输入取票人姓名' }
                value={ receName }
                onChange={ e => { handleChangeName(e) } }
              >取票人姓名</InputItem>
              <InputItem
                placeholder={ '请输入取票人手机号' }
                maxLength={ 11 }
                value={ recePhone }
                onChange={ e => { handleChangePhone(e) } }
              >取票人手机号</InputItem>
            </List> }
            { receivingStyle === 4 && <List>
              <InputItem
                placeholder={ '请输入取票人姓名' }
                value={ receName }
                onChange={ e => { handleChangeName(e) } }
              >取票人姓名</InputItem>
              <InputItem
                placeholder={ '请输入取票人手机号' }
                maxLength={ 11 }
                value={ recePhone }
                onChange={ e => { handleChangePhone(e) } }
              >取票人手机号</InputItem>
            </List> }
            { receivingStyle === 3 && <p className='infotip'>现场取票：请携带和所填姓名一致的身份证前往演出地址取票</p> }
            { receivingStyle === 4 && <p className='infotip'>出票成功后，会通过短信将电子票凭证发到上面手机号</p> }
          </div>
          <WhiteSpace size='lg' />
          <NewPromotion handleChange={ res => { handleCur(res) } } orderType='piaowu' channel={ channel } amount={ ticket.dealPrice * num * 1 } count={ num * 1 } />
        </div>
        <div className='sebt_bt'>
          <p className='real_pri'>
            <span className='sebt_cl'>已优惠:{ (curDiscountData && curDiscountData.discount) ? curDiscountData.discount.toFixed(2) : '0.0' }</span>
            <span>实付:<i>¥{ ticket ? (receivingStyle === 1 ? ((ticket.dealPrice * num) + fee).toFixed(2) : (ticket.dealPrice * num).toFixed(2)) : '0.0' }</i></span>
          </p>
          <p className='real_go' onClick={ () => { handleSubmit(curDiscountData, contact, receivingStyle, receName, recePhone) } }>立即下单</p>
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}

// 订单详情组件
const Oderdetl = ({ event, ticket, num }) => {
  const { eventDate, eventWeekday, eventTime, eventImgUrlv } = event
  const { facePrice, dealPrice } = ticket
  return (
    <div className='Oderdetail'>
      <img alt='piaowu' src={ eventImgUrlv } />
      <div className='orderInfo'>
        <p>{ event.name || ticket.name }</p>
        <p>{ `时间：${ eventDate }  ${ eventWeekday }${ eventTime }` }</p>
        { facePrice && <p>{ `票面价：¥${ facePrice }` }</p> }
        <p><span>售价：<i style={{ color: 'ff4848' }}>¥{ dealPrice }</i></span><span>{ `数量：${ num }张` }</span></p>
      </div>
    </div>
  )
}

// 乘客信息组件
const Continfo = ({ fee, contact, handleChangecontact }) => {
  // const { name, gender, phone, city, county, address, detail, houseNum } = contact
  return (
    <div
      className='nocant'
      onClick={ () => {
        Mask(
          <SlidePage target='right' type='root'>
            <Contact handleChange={ res => { handleChangecontact(res) } } contact={ contact } source={ 'piaowu' } />
          </SlidePage>, { mask: false }
        )
      } }
    >
      { contact &&
        <div>
          <p>{ contact.name }<i>{ contact.gender === 1 ? '  女士' : '  先生' }</i>{ contact.phone }{ contact.tag && <span>{ contact.tag }</span> }</p>
          <p className='addr'>{ `${ contact.city }${ contact.county }${ contact.address }${ contact.detail }${ contact.houseNum }` }</p>
          <p>快递费：{ fee }元</p>
        </div>
      }
      { !contact && <p><Icon type={ require('svg/piaowu/add.svg') } />添加收货地址</p> }
      <Icon type={ require('svg/piaowu/arrowright.svg') } />
    </div>
  )
}

export default Order
