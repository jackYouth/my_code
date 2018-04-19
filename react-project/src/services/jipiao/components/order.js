import React, { Component } from 'react'
import { List, Icon, WhiteSpace, Switch, InputItem } from 'antd-mobile'
import { Mask, SlidePage, Tourist, Billlist, Contact, NewPromotion, Addtourist } from '@boluome/oto_saas_web_app_component'
import { Tuigaiqian } from '../components/detail'
import Baoxian from './baoxian'
import '../style/order.scss'

const Item = List.Item

const Order = order => {
  console.log(order)
  const {
          curDiscountData,
          contactorName,
          contactorPhone,
          contactData,
          invoiceData,
          bool,
          flightData,
          pricingData,
          baoxianData = [],
          pasdata = [],
          insuranceList = [],
          handlePasdata,
          handleInseran,
          handleBool,
          handleInvoiceData,
          handleContactData,
          handleChangeName,
          handleChangePhone,
          handleCur,
          handleSubmit,
          mustSelect = true,
          handleChangepasdata,
        } = order
  if (pricingData) {
    const commodityAmountpri = (pricingData.price + (Number(pricingData.constructionFee) + Number(pricingData.fuelTax))) * pasdata.length
    const commodityAmountnum = pasdata.length
    let baoxianPrice = 0
    const baoxianShowData = baoxianData.map(e => {
      const arr = insuranceList.filter(s => s.code === e.code)
      const num = arr.length > 0 ? arr[0].credentialCodes.length : 0
      baoxianPrice += e.price * num
      return {
        name:  e.name,
        price: e.price,
        num,
      }
    })
    const subPre = (commodityAmountpri + baoxianPrice) + (bool ? 20 : 0)
    const subPri = subPre - ((curDiscountData && curDiscountData.discount) ? curDiscountData.discount : 0)
    const subPrice = (commodityAmountnum > 0 && subPri <= 0) ? 0.01 : subPri
    const Multiplesel = true
    return (
      <div className='order'>
        <div className='ordermain'>
          <Card flightData={ flightData } pricingData={ pricingData } />
          <p className='pricing_show'>
            <span>{ `${ pricingData.cabinType }¥${ pricingData.price }` }</span>
            <span>机建＋燃油¥{ Number(pricingData.constructionFee) + Number(pricingData.fuelTax) }</span>
            <span onClick={
                () => Mask(
                  <SlidePage target='right' showClose={ false } >
                    <Tuigaiqian data={ pricingData } />
                  </SlidePage>,
                  { mask: false, style: { position: 'absolute' } }
                )
              }
            >退改签规则</span>
          </p>

          <WhiteSpace size='lg' />

          <div className='passenger'>
            {
              pasdata.length > 0 && pasdata.map(e => <Passenger key={ e.id } insuranceList={ insuranceList } pasdata={ pasdata } itemdata={ e } handlePasdata={ handlePasdata } handleChangepasdata={ handleChangepasdata } />)
            }
            <p className='add_passenger' onClick={
                () => Mask(
                  <SlidePage target='right' showClose={ false } >
                    <Tourist checkedArr={ pasdata || [] } noUesChildren={ '暂不支持儿童/婴儿票' } handleChange={ contact => handlePasdata(pasdata, contact, true) } Multiplesel={ Multiplesel } />
                  </SlidePage>,
                  { mask: false, style: { position: 'absolute' } }
                )
              }
            >
              <span style={{ fontSize: '0.45rem', marginRight: '0.1rem' }}>+</span>
              <span> 添加乘客</span>
            </p>
          </div>

          <WhiteSpace size='lg' />

          <List>
            <InputItem
              placeholder={ '请输入联系人姓名' }
              value={ contactorName }
              onChange={ e => { handleChangeName(e) } }
            >联系人</InputItem>
            <InputItem
              placeholder={ '请输入联系人手机号' }
              maxLength={ 11 }
              value={ contactorPhone }
              onChange={ e => { handleChangePhone(e) } }
            >手机号</InputItem>
          </List>

          <WhiteSpace size='lg' />

          {
            pasdata.length > 0 && baoxianData.length > 0 && <div className='baoxianShow' onClick={
              () => Mask(
                <SlidePage target='right' showClose={ false } >
                  <Baoxian pasdata={ pasdata } baoxianData={ baoxianData } insuranceList={ insuranceList } handleInseran={ res => handleInseran(res) } />
                </SlidePage>,
                { mask: false, style: { position: 'absolute' } }
              )
            }
            >
              <div>
                {
                  baoxianShowData.map(e => <p key={ e.name }>{ e.name }<span><i>¥{ e.price }</i>/份{ e.num ? `x${ e.num }` : '' }</span></p>)
                }
              </div>
              <div>
                <Icon type={ require('svg/jipiao/arrowRight.svg') } />
              </div>
            </div>
          }

          { pasdata.length > 0 && <WhiteSpace size='lg' /> }

          <List>
            <Item extra={ <Switch platform='ios' checked={ bool } onChange={ checked => { handleBool(checked) } } /> }>报销凭证</Item>
            {
              bool &&
              <div>
                <Item><div className='billinfo'><span>凭证类型</span><div>行程单和差额发票</div></div></Item>
                <Item arrow='horizontal'>
                  <div className='billinfo'>
                    <span>发票抬头</span>
                    <div onClick={ () => {
                      Mask(
                        <SlidePage target='right' type='root' showClose={ false }>
                          <Billlist mustSelect={ mustSelect } billBack={ res => { handleInvoiceData(res) } } selectData={ invoiceData } />
                        </SlidePage>, { mask: false }
                      )
                    } }
                    >{
                      invoiceData ? invoiceData.invoiceTitle : '请选择发票信息'
                    }</div>
                  </div>
                </Item>
                <Item><div className='billinfo'><span>配送方式</span><div>快递¥20</div></div></Item>
                <Item arrow='horizontal'>
                  <div className='billinfo'>
                    <span>收货地址</span>
                    <div onClick={ () => {
                      Mask(
                        <SlidePage target='right' type='root'>
                          <Contact
                            handleChange={ res => { handleContactData(res) } }
                            chooseContact={ contactData }
                            source={ 'jipiao' }
                          />
                        </SlidePage>, { mask: false }
                      )
                    } }
                    >
                      {
                        contactData ?
                          <div className='addrinfo'>
                            <p>{ contactData.name }{ contactData.gender === '1' ? '  女士' : '  先生' }<span>{ contactData.phone }</span></p>
                            <p>{ `${ contactData.city }${ contactData.county }${ contactData.address }${ contactData.detail }${ contactData.houseNum }` }</p>
                          </div>
                          : '请选择收货地址'
                      }
                    </div>
                  </div>
                </Item>
              </div>
            }
          </List>

          <WhiteSpace size='lg' />

          { pasdata.length > 0 && <NewPromotion handleChange={ res => { handleCur(res) } } orderType='jipiao' channel='qunar' amount={ subPre } count={ commodityAmountnum } /> }

          { pasdata.length > 0 && <WhiteSpace size='lg' /> }
          <WhiteSpace size='lg' />
        </div>
        <div className='orderbottom'>
          <div className='orderPrice'>
            {
              pasdata.length > 0 && <div>
                <p>实付¥{ subPrice.toFixed(2) }</p>
                { (curDiscountData && curDiscountData.discount) ? <p>{ `优惠¥${ (curDiscountData.discount * 1).toFixed(2) }` }</p> : '' }
              </div>
            }
            { pasdata.length > 0 && <p onClick={ () => {
              Mask(
                <SlidePage target='right' type='root' showClose={ false }>
                  <Pridetail order={ order } subPrice={ subPrice } baoxianShowData={ baoxianShowData } />
                </SlidePage>, { mask: false }
              )
            } }
            >明细<Icon type={ require('svg/jipiao/mingxi.svg') } /></p> }
          </div>
          <span style={ pasdata.length > 0 ? {} : { background: '#e5e5e5' } } className='orderbtn' onClick={ () => { handleSubmit(order) } }>
            立即下单
          </span>
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}

// 航班信息展示
const Card = ({ flightData, pricingData }) => {
  const { flightTypeFullName, departureTime, depAirport, depTerminal, departureDate, flightTimes, arriveTime, arrAirport, arrTerminal, arriveDate, airlineName, flightNum, correct, meal, stop } = flightData
  const { stopCity } =  pricingData
  return (
    <div className='detailCart'>
      <div className='cart_main'>
        <div>
          <p>{ departureDate }</p>
          <h3>{ departureTime }</h3>
          <p>{ depAirport }{ depTerminal }</p>
        </div>
        <div className='cart_mainmid'>
          <p>{ flightTimes }</p>
          <p>{ stop ? <span>停</span> : '' }</p>
          { stopCity && <p>{ stopCity }</p> }
        </div>
        <div>
          <p>{ arriveDate }</p>
          <h3>{ arriveTime }</h3>
          <p>{ arrAirport }{ arrTerminal }</p>
        </div>
      </div>
      <p>{ `${ airlineName }${ flightNum }   ${ flightTypeFullName }  准点率${ correct }  ${ meal ? '提供餐食' : '' }` }</p>
    </div>
  )
}

// 乘客信息
class Passenger extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bool: false,
    }
  }

  handleSwitch() {
    const { bool } = this.state
    this.setState({ bool: !bool })
  }

  goEdit() {
    const { itemdata, pasdata, insuranceList, handleChangepasdata } = this.props
    Mask(
      <SlidePage target='right' type='root'>
        <Addtourist { ...{ editContact: itemdata } } onSuccess={ data => { handleChangepasdata(pasdata, data, insuranceList) } } />
      </SlidePage>, { mask: false }
    )
  }

  render() {
    // const { name, id } = flightData
    const { bool } = this.state
    const { itemdata, pasdata, handlePasdata, insuranceList } = this.props
    const { name, idCard } = itemdata
    return (
      <div className='passenger_list' onClick={ () => { if (bool) { this.handleSwitch() } } }>
        <div className='passenger_icon' style={ bool ? { width: '0rem' } : {} } >
          <Icon type={ require('svg/jipiao/deletbtn.svg') } onClick={ () => { this.handleSwitch() } } />
        </div>
        <div className='passenger_main' style={ bool ? { paddingLeft: '0.3rem' } : {} } onClick={ () => { if (!bool) { this.goEdit() } } }>
          <p><span>{ name }</span>成人票</p>
          <p>证件号：{ idCard }</p>
        </div>
        <div onClick={ () => { this.goEdit() } }
          className='passenger_jump' style={ bool ? { width: '0rem' } : {} }
        >
          <Icon type={ require('svg/jipiao/arrowRight.svg') } />
        </div>
        <div className='passenger_delet' style={ bool ? {} : { width: '0rem' } }
          onClick={ () => { handlePasdata(pasdata, itemdata, false, insuranceList) } }
        >
          <span>删除</span>
        </div>
      </div>
    )
  }
}

// 费用明细
const Pridetail = props => {
  const { handleContainerClose, order, baoxianShowData = [], subPrice } = props
  const { pricingData, curDiscountData, pasdata = [], bool } = order
  const bxArr = baoxianShowData.filter(o => o.num > 0)
  console.log(order)
  return (
    <div className='pridetail'>
      <fieldset>
        <legend>费用明细</legend>
      </fieldset>
      <h2>¥{ subPrice.toFixed(2) }</h2>
      <div className='main_pri'>
        <p><span>成人票价</span><span>¥{ pricingData.price } <i>x { pasdata.length }人</i></span></p>
        <p><span>燃油</span><span>¥{ pricingData.fuelTax } <i>x { pasdata.length }人</i></span></p>
        <p><span>机建</span><span>¥{ pricingData.constructionFee } <i>x { pasdata.length }人</i></span></p>
      </div>
      {
        (bool || bxArr.length > 0) && <div className='add_pri'>
          {
            bool ? <p><span>报销凭证</span><span>¥20 <i>x 1份</i></span></p> : ''
          }
          {
            bxArr.map(e => <p key={ `${ e.name }mingxi` }><span>{ e.name }</span><span>¥{ e.price } <i>x { e.num }份</i></span></p>)
          }
        </div>
      }
      {
        (curDiscountData && curDiscountData.discount) ? <div className='cup_pri'><p><span>优惠券</span><span>-¥{ curDiscountData.discount }</span></p></div> : ''
      }
      <div className='closebtn'>
        <p><Icon onClick={ () => { handleContainerClose() } } type={ require('svg/jipiao/close.svg') } /></p>
      </div>
    </div>
  )
}

export default Order
