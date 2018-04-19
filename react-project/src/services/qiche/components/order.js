import React, { Component } from 'react'
import { List, Icon, WhiteSpace, Switch, InputItem } from 'antd-mobile'
import { Mask, SlidePage, Tourist, NewPromotion } from '@boluome/oto_saas_web_app_component'
// import { NewPromotion } from '@boluome/oto_saas_web_app_component'
import Baoxian from './baoxian'
import '../style/order.scss'
import chengke from '../img/chengke.png'

const Item = List.Item

const Order = order => {
  console.log(order)
  const {
          checiinfo,
          curDiscountData,
          contactorId,
          contactorName,
          contactorPhone,
          bool,
          jisu,
          servicePrice = 0,
          baoxianData = [],
          pasdata = [],
          handleBool,
          handleCur,
          handleContactor,
          handlePasdata,
          handleChangePhone,
          handleSubmit,
    } = order
  const Multiplesel = true
  const commodityAmountnum = pasdata.length
  if (checiinfo) {
    const { maxTicketCount, ticketPrice } = checiinfo
    const jisuPri = (jisu && bool) ? jisu.productPrice : 0
    const bxArr = baoxianData.filter(e => e.choose)
    const bxPri = (bxArr.length) > 0 ? bxArr[0].productPrice * 1 : 0
    const curPri = (curDiscountData && curDiscountData.discount) ? curDiscountData.discount : 0
    const subPrice = ((((ticketPrice + jisuPri) + bxPri) + servicePrice) * pasdata.length) - curPri
    console.log(bxArr, jisuPri, bxPri)
    return (
      <div className='order'>
        <div className='ordermain'>
          { checiinfo && <Card checiinfo={ checiinfo } /> }

          <WhiteSpace size='lg' />

          <div className='passenger'>
            <h3>
              <p><span><img alt='ck' src={ chengke } />添加乘客</span>每个订单限购{ maxTicketCount }张票</p>
              <Icon type={ require('svg/qiche/add.svg') } onClick={
                () => Mask(
                  <SlidePage target='right' showClose={ false } >
                    <Tourist checkedArr={ pasdata || [] } noUesChildren={ '暂不支持儿童/婴儿票' } handleChange={ contact => handlePasdata(pasdata, contact, true, contactorId) } Multiplesel={ Multiplesel } />
                  </SlidePage>,
                  { mask: false, style: { position: 'absolute' } }
                )
              }
              />
            </h3>
            {
              pasdata.length > 0 && pasdata.map(e => <Passenger key={ `${ Math.random() }` } contactorId={ contactorId } pasdata={ pasdata } itemdata={ e } handlePasdata={ handlePasdata } handleContactor={ handleContactor } />)
            }
          </div>

          <WhiteSpace size='lg' />

          <List>
            <InputItem
              value={ contactorName }
              editable={ false }
            > 取票人</InputItem>
            <InputItem
              placeholder={ '用于接收取票信息' }
              maxLength={ 11 }
              value={ contactorPhone }
              onChange={ e => { handleChangePhone(e) } }
            >联系手机</InputItem>
          </List>

          { jisu && <WhiteSpace size='lg' /> }

          { jisu && <List>
            <Item extra={ <Switch platform='ios' checked={ bool } onChange={ checked => { handleBool(checked) } } /> }>
              <div className='jisu'>
                <div>
                  <p style={{ fontSize: '0.28rem', color: '#333333' }}>{ jisu.name }</p>
                  <p style={{ fontSize: '0.24rem', color: '#999999' }}>{ jisu.productDescription }</p>
                </div>
                <p style={{ color: '#ff4848' }}>￥{ jisu.productPrice }/份</p>
              </div>
            </Item>
          </List>
          }

          { baoxianData.length > 0 && <WhiteSpace size='lg' /> }

          { baoxianData.length > 0 && <List>
            <Item arrow='horizontal' extra={ <span style={{ fontSize: '0.28rem', color: '#999999' }}>{ bxArr.length > 0 ? bxArr[0].insuranceProductName : '不购买保险' }</span> } onClick={ () => {
              Mask(
                <SlidePage target='right' type='root' showClose={ false }>
                  <Baoxian baoxianData={ baoxianData } />
                </SlidePage>, { mask: false }
              )
            } }
            >
              <span style={{ fontSize: '0.28rem' }}>出行保险</span>
            </Item>
          </List>
          }

          <WhiteSpace size='lg' />

          { pasdata.length > 0 && <NewPromotion handleChange={ res => { handleCur(res) } } orderType='qiche' channel='tongcheng' amount={ subPrice } count={ commodityAmountnum } /> }

          { pasdata.length > 0 && <WhiteSpace size='lg' /> }

          <div className='wxtip'>
            <p>温馨提示</p>
            <p>成功支付后凭系统发送短信中的取票号、取票密码与身份证至汽车站取票乘车；</p>
            <p>若发车前30分钟内仍未收到取票短信，请及时拨打客服热线400-7777-777核实；</p>
            <p>暂不支持携童票购买，若需要携带免票儿童，请提前至汽车站办理，以免耽误行程。</p>
          </div>

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
                  <Pridetail order={ order } subPrice={ subPrice } jisuPri={ jisuPri } bxPri={ bxPri } />
                </SlidePage>, { mask: false }
              )
            } }
            >明细<Icon type={ require('svg/qiche/mingxi.svg') } /></p> }
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

// 信息展示
const Detail = ({ handleContainerClose }) => {
  return (
    <div className='gou_detail' onClick={ () => { handleContainerClose() } }>
      <div>
        <h2>购票说明</h2>
        <p>1.同一笔订单可购买的车票数量不超过3张，如购票乘车人数超出3位，请分开预订。</p>
        <p>3.当出票失败后，您将会收到出票失败的短信，请勿继续预订当前车次，所退款项将在1-15个工作日内原路退还到您的支付账户中。</p>
        <p>4.部分车站增收服务费，如去车站窗口退票服务费车站不予退还。</p>
        <p>5.系统为您提供的车型信息为参考车型，实际可能根据客运站的调整有所变化，具体以各客运站发车车型为准。</p>
        <h2>取票说明</h2>
        <p>1.请提前至少30分钟（节假日等高峰期建议提前一小时），凭取票人身份证、取票号和取票密码至出发车站取票。（若有取票机，则可凭借取票号取票；若无取票机，则需凭借取票人身份证到窗口办理）。</p>
        <p>2.如您在发车前30分钟仍未收到车票相关信息，请及时拨打4007-777-777进行核实。</p>
        <h2>退改说明</h2>
        <p>1.目前汽车票暂不支持线上退票，如需退票，请在出发车站取出纸质票，再到车站窗口办理退票，办理退票手续车站会收取票面价10%-20%手续费，具体金额请以各客运站站公布的规则为准。</p>
        <p>2.开车后一般不退票（请以各客运站规定为准）。</p>
        <p>3.由于承运人责任造成班车晚点、托班等延迟运输的，旅客可根据需要改乘其他班次或者退票，免收退票费。</p>
        <p>4.临时加班的班次，无法退票（如车站可退票，请以车站为准）。</p>
        <p>5.汽车票业务暂时不支持线上改签操作，如需改签，建议您在发车前至出发车站，在取出纸质票后，再到车站窗口办理退票改签。具体以车站实际情况为准。</p>
        <p>6.办理退票不再支持参与红包、优惠券、立减等活动，服务费不予退还。</p>
        <p>7.部分车站退票需原支付渠道退款，您至始发站办理退票时若车站只同意退票未给予退款，请在3个工作日内联系客服核实并完成退款。</p>
      </div>
    </div>
  )
}

// 车次信息展示
const Card = ({ checiinfo }) => {
  const { coachType, depatureCity, arriveCity, departureStation, arriveStation, departureDate, departureTime, travelTime } = checiinfo
  const datesplit = departureDate.split('-')
  const datetxt = `${ datesplit[1] }月${ datesplit[2] }日${ departureTime }`
  return (
    <div className='detailCart'>
      <p className='qctit'>
        <span>参考车型：{ coachType }</span>
        <span onClick={ () => {
          Mask(
            <SlidePage target='right' type='root' showClose={ false }>
              <Detail />
            </SlidePage>, { mask: false }
          )
        } }
        ><Icon type={ require('svg/jipiao/tiping.svg') } />购票、取票、退票说明</span>
      </p>
      <div className='cart_main'>
        <div>
          <h3>{ depatureCity }</h3>
          <p>{ departureStation }</p>
        </div>
        <div className='cart_mainmid'>
          <p>{ datetxt }</p>
          <p />
          <p>{ travelTime }</p>
        </div>
        <div>
          <h3>{ arriveCity }</h3>
          <p>{ arriveStation }</p>
        </div>
      </div>
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

  render() {
    // const { name, id } = flightData
    const { bool } = this.state
    const { itemdata, pasdata, contactorId, handlePasdata, handleContactor } = this.props
    const { id, name, idCard } = itemdata
    return (
      <div className='passenger_list' onClick={ () => { if (bool) { this.handleSwitch() } } }>
        <div className='passenger_icon' style={ bool ? { width: '0rem' } : {} } >
          <Icon type={ require('svg/jipiao/deletbtn.svg') } onClick={ () => { this.handleSwitch() } } />
        </div>
        <div className='passenger_main'>
          <p><span>{ name }</span>成人票</p>
          <p>身份证：{ idCard }</p>
        </div>
        <div onClick={ () => { handleContactor(itemdata) } } className='passenger_jump'>
          <span style={ contactorId === id ? { color: '#fff', background: '#ffab00', borderRadius: '4px', padding: '0.05rem 0.1rem', desplay: 'inline-block' } : {} }>
            { contactorId === id ? '取票人' : '设为取票人' }
          </span>
        </div>
        <div className='passenger_delet' style={ bool ? {} : { width: '0rem' } }
          onClick={ () => { handlePasdata(pasdata, itemdata, false, contactorId) } }
        >
          <span>删除</span>
        </div>
      </div>
    )
  }
}

// 费用明细
const Pridetail = props => {
  const { handleContainerClose, order, jisuPri, bxPri, subPrice } = props
  const { checiinfo, servicePrice, curDiscountData, pasdata = [] } = order
  console.log(order)
  return (
    <div className='pridetail'>
      <fieldset>
        <legend>费用明细</legend>
      </fieldset>
      <h2>¥{ subPrice.toFixed(2) }</h2>
      <div className='main_pri'>
        <p><span>成人票价</span><span>¥{ checiinfo.ticketPrice } <i>x { pasdata.length }人</i></span></p>
        <p><span>服务费</span><span>¥{ servicePrice } <i>x { pasdata.length }人</i></span></p>
      </div>
      {
        (jisuPri > 0 || bxPri > 0) && <div className='add_pri'>
          {
            jisuPri > 0 ? <p><span>极速出票</span><span>¥{ jisuPri } <i>x 1份</i></span></p> : ''
          }
          {
            bxPri > 0 ? <p><span>交通意外险</span><span>¥{ bxPri } <i>x 1份</i></span></p> : ''
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
