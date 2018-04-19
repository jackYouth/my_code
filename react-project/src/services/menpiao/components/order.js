import React from 'react'
import moment from 'moment'
import { List, WhiteSpace, Toast, Icon, InputItem } from 'antd-mobile' // InputItem
import { Mask, NewPromotion } from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'

import '../style/order.scss'
import svgAdd from '../img/svg_add.svg'
import down from '../img/down.svg'
import eedown from '../img/ee_down.svg'
import add from '../img/add.svg'
import eeadd from '../img/ee_add.svg'

const Item = List.Item

// 主体部分
const Order = props => {
  const { handleGoMoreDate, handleAddTourist,
    handleSumUP, handleNumDown, OrderListData, TimeListData, goodsCardata,
    sum, countPrice, chooseType, handleGetprice, morenPrice, discount,
    handleSaveOrder, handleReliefChange, curDiscountData, orderHeight,
    handleMinimum, handleEmailvalue, emailVal,
  } = props
  let minimumProm // 这里只是为了首次进入的时候传入红包活动的值展示正确，可(待)优化
  if (OrderListData) {
    minimumProm = OrderListData.minimum
  }
  // console.log('props----', props)
  // 入园须知部分
  const handleShowNotice = () => {
    Mask(<NoticeCom OrderListData={ OrderListData } />)
  }
  // 当超出限制的时候
  const handleLimiteNumber = (lim, limiteNum) => {
    if (goodsCardata.length <= 0) {
      Toast.info('请添加取票人', 2)
      return
    }
    if (lim === 0) {
      if (sum <= limiteNum) {
        Toast.info(`最少购买 ${ limiteNum } 张票`, 2)
        // Toast.info('最少购买' + `${ limiteNum }` + '张票')
        return
      }
      handleNumDown(limiteNum)
    } else if (lim === 1) {
      if (sum >= limiteNum) {
        Toast.info(`最多购买 ${ limiteNum } 张票`, 2)
        // Toast.info('最多购买' + `${ limiteNum }` + '张票')
        return
      }
      handleSumUP(limiteNum)
    }
  }
  // 姓名 + 电话
  const handlePhoneChange = phone => {
    const tel = phone.replace(/\s+/g, '')
    setStore('userSelfPhone', tel, 'session')
  }
  // const handleNameChange = name => {
  //   setStore('userSelfName', name, 'session')
  //   // handleNameSave(name)
  // }
  // 验证填写信息是否正确--点击提交订单
  const handleTestMessage = () => {
    const phone = getStore('userSelfPhone', 'session')
    if (goodsCardata.length <= 0) {
      Toast.info('请添加取票人', 2)
      return
    }
    if (!(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/.test(phone))) {
      Toast.info('请填写正确手机', 2)
      return
    }
    handleSaveOrder(OrderListData, goodsCardata, countPrice, sum, morenPrice, curDiscountData, emailVal)
  }
  if (OrderListData) {
    return (
      <div className='orderWrap' style={{ height: orderHeight }}>
        <div className='orderMain'>
          <Visitcard morenPrice={ morenPrice } OrderListData={ OrderListData } />
          <Message chooseType={ chooseType }
            countPrice={ countPrice } handleGoMoreDate={ handleGoMoreDate }
            handleShowNotice={ handleShowNotice } TimeListData={ TimeListData }
            handleLimiteNumber={ handleLimiteNumber } sum={ sum } OrderListData={ OrderListData }
            handleMinimum={ handleMinimum } handleGetprice={ handleGetprice }
          />
          <WhiteSpace size='lg' />
          <Tourist goodsCardata={ goodsCardata }
            handleAddTourist={ handleAddTourist }
            handlePhoneChange={ handlePhoneChange }
            OrderListData={ OrderListData }
            handleEmailvalue={ handleEmailvalue }
            emailVal={ emailVal }
          />
          <WhiteSpace size='lg' />
          <TrickShow OrderListData={ OrderListData } sum={ sum } morenPrice={ morenPrice } />
          <WhiteSpace size='lg' />
          {
            goodsCardata && goodsCardata.length > 0 ? (<NewPromotion orderType='menpiao' channel='lvmama' count={ minimumProm && sum < minimumProm ? minimumProm : sum }
              amount={ minimumProm && sum < minimumProm ? minimumProm * countPrice : sum * countPrice } handleChange={ reply => handleReliefChange(reply) }
            />) : ('')
          }
        </div>
        <OrderFooter OrderListData={ OrderListData } sum={ sum }
          goodsCardata={ goodsCardata } countPrice={ countPrice }
          handleTestMessage={ handleTestMessage } morenPrice={ morenPrice }
          discount={ discount } curDiscountData={ curDiscountData }
          emailVal={ emailVal }
        />
      </div>
    )
  }
  return (<div />)
}

export default Order

const Visitcard = ({ OrderListData, morenPrice }) => {
  if (OrderListData && morenPrice) {
    const { name } = OrderListData
    const { price = 0 } = morenPrice
    // console.log(name, address, openTime, ticketType)
    return (
      <div className='orderCard'>
        <Item className='ordertitle' extra={
          <div className='orderTrickPrice'>{ `¥ ${ price }` }</div>
        }
        >{ name }</Item>
      </div>
    )
  }
  return (<div />)
}
// 填写信息部分
const Message = ({ handleGoMoreDate, handleShowNotice, TimeListData,
                  handleGetprice, chooseType, handleLimiteNumber,
                  OrderListData, sum, handleMinimum }) => { // console.log('TimeListData----',TimeListData);
  // 日期选择部分
  const todayDate =  moment().format('YYYY-MM-DD')
  const tomorrowDate = moment().add(1, 'days').format('YYYY-MM-DD')
  const moreChoose = getStore('chooseTime', 'session')
  let todayPrice
  let tomorrowPrice
  let morePrice
  let minimum
  let maximum
  if (OrderListData) {
    maximum = OrderListData.maximum
    minimum = OrderListData.minimum
    handleMinimum(minimum)
  } else {
    minimum = 1
    maximum = 1000
  }
  if (TimeListData) {
    todayPrice = TimeListData.filter(p => p.date === todayDate)[0]
    tomorrowPrice = TimeListData.filter(p => p.date === tomorrowDate)[0]
    morePrice = TimeListData.filter(p => p.date !== todayDate && p.date !== tomorrowDate)[0]
    // console.log('todayPrice---', todayPrice, 'tomorrowPrice---', tomorrowPrice, 'morePrice---', morePrice, 'moreChoose---', moreChoose)
    if (moreChoose && moreChoose.prices) {
      morePrice = moreChoose
    }
    let todayClass = ''
    let tomorrowClass = ''
    let moreClass = ''
    if (chooseType === 0) {
      if (todayPrice) {
        todayClass = 'orderOrg'
        tomorrowClass = ''
        moreClass = ''
      } else {
        todayClass = 'noOrder'
        if (tomorrowPrice) {
          tomorrowClass = 'orderOrg'
          moreClass = ''
        } else {
          tomorrowClass = 'noOrder'
          moreClass = 'orderOrg'
        }
      }
    } else if (chooseType === 1) {
      if (tomorrowPrice) {
        tomorrowClass = 'orderOrg'
        moreClass = ''
        if (todayPrice) {
          todayClass = ''
        } else {
          todayClass = 'noOrder'
        }
      } else {
        tomorrowClass = 'noOrder'
      }
    } else if (chooseType === 2) {
      if (morePrice) {
        moreClass = 'orderOrg'
        if (todayPrice) {
          todayClass = ''
        } else {
          todayClass = 'noOrder'
        }
      } else {
        moreClass = 'noOrder'
      }
    } else {
      todayClass = 'noOrder'
    }
    return (
      <div className='MessageWrap'>
        <div className='noticText' onClick={ () => { handleShowNotice() } }>入园须知，退票说明 </div>
        <List>
          <Item className='datewrap'>
            <div className='dateTip'>游玩日期</div>
            <div className='date'>
              <div className={ `today dateoto ${ todayClass }` }>
                {
                  todayPrice ? (<span onClick={ () => { handleGetprice(0, todayPrice) } }><span>今日</span><span>¥{ todayPrice.date.substring(5) }</span></span>) : (<span><span>今日</span><span>不可订</span></span>)
                }
              </div>
              <div className={ `tomorrow dateoto ${ tomorrowClass }` }>
                {
                  tomorrowPrice ? (<span onClick={ () => { handleGetprice(1, tomorrowPrice) } }><span>明天</span><span>{ tomorrowPrice.date.substring(5) }</span></span>) : (<span><span>明天</span><span>不可订</span></span>)
                }
              </div>
              <div className={ `moredate dateoto ${ moreClass }` } onClick={ () => { handleGoMoreDate() } }>
                {
                  morePrice ? (<span onClick={ () => { handleGetprice(2, moreChoose && moreChoose.price ? moreChoose : morePrice) } } ><span className='moredateSpan'>更多日期</span><span>{ moreChoose && moreChoose.price ? moreChoose.date.substring(5) : morePrice.date.substring(5) }</span></span>) : (<span><span>更多日期</span><span>不可订</span></span>)
                }
              </div>
            </div>
            <div style={{ clear: 'both' }} />
          </Item>
          <Item className='addnumbel' extra={
            <div className='sumbox'>
              <span onClick={ () => { handleLimiteNumber(0, minimum) } }><Icon type={ `${ minimum && sum > minimum ? eedown : down }` } /></span>
              <span className='Sum'>{ `${ minimum && sum < minimum ? minimum : sum }` }</span>
              <span onClick={ () => { handleLimiteNumber(1, maximum) } }><Icon type={ `${ maximum && sum < maximum ? eeadd : add }` } /></span>
            </div> }
          >门票数量 { OrderListData.minimum > 1 ? (<span>({ OrderListData.minimum }张起购)</span>) : ('') }</Item>
        </List>
      </div>
    )
  }
  return (<div />)
}

// 入园须知部分
const NoticeCom = ({ OrderListData }) => {
  if (OrderListData) {
    const { name, importentPoint, notice, costInclude } = OrderListData
    // console.log('notice------', notice)
    return (
      <div className='noticeWrap'>
        <div className='orderinfoMian'>
          <div className='orderinfoHeader'>
            <span className='infoclose' /><span className='infortitle'>入园须知</span>
          </div>
          <div className='orderinfo'>
            <div className='info'>
              <p className='infotop'>{ name }</p>
              <p>费用包含：</p>
              <p>{ costInclude }</p>
              <p>入园须知：</p>
              <p>{ notice.effectiveDesc }</p>
              <p>重要须知：</p>
              <p>{ importentPoint }</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (<div />)
}

// 添加游客部分
const Tourist = ({ handleAddTourist, goodsCardata, OrderListData, handleEmailvalue, emailVal = '' }) => {
  const { traveller = {} } = OrderListData
  const { email } = traveller
  if (goodsCardata && goodsCardata.length > 0) {
    const booker = goodsCardata.map(item => { return item })[0]
    setStore('userSelfName', booker.name, 'session')
    setStore('userSelfPhone', booker.phone.replace(/\s+/g, ''), 'session')
    return (
      <div className='addtouristWrap'>
        {
        goodsCardata.map((item, index) => (
          <div key={ `${ index + item }` }>
            <List>
              <Item>取票信息</Item>
              <Item className='addmessage oto' extra={ item.name } arrow='horizontal' onClick={ () => handleAddTourist() }>
                取票人
              </Item>
              <Item className='addnumbel oto' extra={ item.idCard }>
                身份证
              </Item>
              <Item className='addnumbel oto' extra={ item.phone.replace(/\s+/g, '') }>
                手机号
              </Item>
              {
                email && email !== 'TRAV_NUM_NO' ? (
                  <InputItem className='addnumbel oto'
                    placeholder='请输入电子邮箱'
                    onChange={ v => handleEmailvalue(v) }
                    defaultValue={ emailVal }
                  >
                    <span style={{ color: '#333', fontSize: '0.28rem' }}>电子邮箱</span>
                  </InputItem>
                ) : ('')
              }
            </List>
          </div>
        ))
        }
      </div>
    )
  }
  return (
    <div className='addtouristWrap'>
      <Item className='addpeople'>
        <div className='addpeoplediv' onClick={ () => { handleAddTourist() } }>
          <Icon type={ svgAdd } /><span>添加取票人</span>
        </div>
      </Item>
    </div>
  )
}

// <InputItem className='messageint' type='phone' placeholder='请输入联系人手机号' defaultValue={ item.phone.replace(/\s+/g, '') } value={ item.phone.replace(/\s+/g, '') } onChange={ handlePhoneChange } maxLength='11'>手机号</InputItem>
// 驴妈妈出票展示
const TrickShow = ({ OrderListData, sum, morenPrice }) => {
  if (OrderListData && morenPrice) {
    // console.log('OrderListData---', OrderListData)
    const { name, minimum } = OrderListData
    return (
      <div className='tricekShow'>
        <List>
          <Item>驴妈妈出票</Item>
          <Item>{ name }</Item>
          <Item extra={ <div>{ `${ minimum && sum < minimum ? minimum : sum } 张` }</div> }>数量</Item>
          <Item extra={ <div>{ `¥ ${ minimum && sum < minimum ? (minimum * morenPrice.price).toFixed(2) : (sum * morenPrice.price).toFixed(2) }` }</div> }>票价</Item>
        </List>
      </div>
    )
  }
  return (<div />)
}

// 底部下单部分
const OrderFooter = ({ OrderListData, goodsCardata, countPrice, sum, handleTestMessage, morenPrice, discount, curDiscountData, emailVal }) => {
  // console.log('curDiscountData', curDiscountData)
  if (OrderListData && morenPrice) {
    const { minimum } = OrderListData
    return (
      <div className='orderFooter'>
        <div className='orderfootPrice'>
          <span>实付：¥</span>
          <span className='price'>{ minimum && sum < minimum ? ((minimum * morenPrice.price) - discount).toFixed(2) : ((sum * morenPrice.price) - discount).toFixed(2) }</span>
          {
            discount && discount !== 0 ? (<span className='downprice'>{ `优惠¥ ${ discount }` }</span>) : ''
          }
        </div>
        <div className={ `orderfooterOn ${ sum && sum !== 0 ? '' : 'orderNouse' }` } onClick={ () => { return sum && sum !== 0 ? handleTestMessage(OrderListData, goodsCardata, countPrice, sum, morenPrice, curDiscountData, emailVal) : '' } }>
          立即下单
        </div>
      </div>
    )
  }
  return (<div />)
}
