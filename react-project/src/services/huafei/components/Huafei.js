import React from 'react'
import { InputItem, WhiteSpace, Icon } from 'antd-mobile'
import { UserCenter, PayTips, ExchangeActivePopup } from '@boluome/oto_saas_web_app_component'
// import vconsole from 'vconsole'

import '../styles/common.scss'
import '../styles/huafei.scss'

const Huafei = ({ hfInfo = { isp: '' }, isFirstIptClick, handleIptClick,
 handleHfClick, handleIptChange, changeFocus, changeBlur, isFocus = false,
 selectedHf = { index: '', list: ['', '', '', '', '', ''] },
 handleSubmit,
 phoneHistorys, handlePhoneHistory, curPhone, visibilityHistory, handleClearHistory, handleClearPhone,
 handlePromotionChange, curDiscountData,
}) => {
  let hfList = [[20], [30], [50], [100], [200], [500]].map(item => ({ title: `${ item[0] }元` }))
  let curHfIndex = 100
  let curHfArea = ''
  let curHfPrice = ''
  let isSubmit = false
  let realPrice = ''   // 设置市场价
  const { isp, area, list = '' } = hfInfo
  if (isp) {   // 当请求回数据后
    hfList = list.map(item => ({ title: `${ item.realPrice }元`, discPrice: `售价 ${ item.price }元` }))
    curHfIndex = 0
    curHfArea = area + isp
    curHfPrice = list[0].price
    isSubmit = 'true'
  } else {    // 当没有数据
    selectedHf = { index: '', list: ['', '', '', '', '', ''] }     // 清空当前选中的所有信息
  }
  if (selectedHf.index) {   // 当已经选择过某个话费后
    curHfIndex = selectedHf.index
    curHfPrice = selectedHf.list.price
    realPrice = selectedHf.list.realPrice
  } else {  // 当没有选择某个话费时，设置初始值
    selectedHf = { index: 0, number: curPhone, isp, area, list: list ? list[0] : '' }
    realPrice = list ? list[0].realPrice : ''
  }
  // 平台活动
  if (!curDiscountData) curDiscountData = {}
  const { discount = 0, activities, coupon } = curDiscountData
  let [activityId, couponId] = ['', '']
  if (activities) activityId = activities.id
  if (coupon) couponId = coupon.id
  let resultPrice = Math.round((curHfPrice - discount) * 100) / 100
  if (resultPrice < 0) resultPrice = 0.01
  resultPrice = resultPrice.toFixed(2)
  const resultPriceL = String(resultPrice).split('.')[0]
  const resultPriceR = String(resultPrice).split('.')[1]
  // 定义价格文字的颜色
  let priceColor = '#333'
  if (isFocus && !isSubmit) priceColor = '#999'
  return (
    <div className='hf'>
      {
        location.pathname.indexOf('chongzhi') <= 0 &&
        (
          <div>
            <UserCenter categoryCode='huafei' showUserCenter={ 1 } />
          </div>
        )
      }
      <div className='header'>
        <HuafeiItem { ...{ curPhone, handleIptChange, isFirstIptClick, handleIptClick, phoneHistorys, visibilityHistory, handlePhoneHistory, handleClearHistory, handleClearPhone, changeFocus, changeBlur, curHfArea } } />
      </div>
      <WhiteSpace />
      <div className='container'>
        {
          hfList.map((item, index) => (
            <div
              key={ item.title }
              className={ index === curHfIndex ? 'inline active' : 'inline' }
              style={{ WebkitJustifyContent: 'center', WebkitAlignItems: 'center', WebkitFlexDirection: 'column', borderWidth: '1px' }}
              onClick={ () => handleHfClick(isp ? { index, number: curPhone, isp, area, list: list[index] } : '', curPhone) }
            >
              {
                console.log('item.discPrice', item.discPrice)
              }
              <h1 style={{ color: index === curHfIndex ? '#ffab00' : priceColor }}>{ item.title }</h1>
              <p>{ item.discPrice }</p>
            </div>
             )
           )
        }
      </div>
      <PayTips title='话费流量充值' content={ <PayTipsContent /> } />
      <div className='footer'>
        <p className='pay-price'>
          { curHfPrice && '实付：' }
          {
            curHfPrice && (<span className='cur-price'>{ `¥ ${ resultPriceL }` }<span style={{ fontSize: '.28rem', display: resultPriceR ? 'inline-block' : 'none' }}>{ `.${ resultPriceR }` }</span></span>)
          }
          { curHfPrice && !discount && <del className='real-price'>{ `¥ ${ realPrice.toFixed(2) }` }</del> }
          { curHfPrice && Boolean(discount) && <span className='real-price'>{ `优惠¥ ${ discount.toFixed(2) }` }</span> }
        </p>
        <p className={ isSubmit ? 'button active' : 'button' } onClick={ () => { selectedHf.number = curPhone; handleSubmit(selectedHf, isSubmit, curPhone, resultPrice, activityId, couponId) } }>立即充值</p>
        {
          curHfPrice &&
          <ExchangeActivePopup orderType='huafei' channel='ofpay' amount={ curHfPrice } popupStyle={{ top: '-1.16rem' }} promotionCallback={ handlePromotionChange } />
        }
      </div>
    </div>
  )
}

export default Huafei

class HuafeiItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }   // 设置input框中设置一个state
    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleIconClick = this.handleIconClick.bind(this)
  }

  handleChange(event) {
    const prePhone = this.state.value
    setTimeout(() => {
      this.setState({ value: event })
      this.props.handleIptChange(event, prePhone) // 调用父组件传过来的参数
    }, 0)
  }

  handleFocus() {
    this.setState({ focused: false, showClear: true })
    this.props.changeFocus(this.state.value)
  }

  handleBlur() {
    this.setState({ showClear: false })
    if (this.state.focused) {     // 点击清除按钮时，不将失焦事件押后
      this.props.changeBlur()
    } else {                    // 不点击清除按钮（如点击历史记录），将失焦事件押后
      setTimeout(this.props.changeBlur, 0)
    }
  }

  handleIconClick() {
    this.setState({ focused: true, showClear: false })
    this.props.handleClearPhone()
  }

  componentWillReceiveProps({ curPhone }) {
    this.setState({ value: curPhone })
  }

  render() {
    const { curPhone, isFirstIptClick = true, handleIptClick,
          phoneHistorys, visibilityHistory, handlePhoneHistory, handleClearHistory,
          curHfArea,
        } = this.props

    const { value, focused, showClear = false } = this.state

    return (
      <div className='number'>
        <InputItem
          type='phone'
          value={ value }
          onChange={ this.handleChange }
          placeholder='请输入要充值的手机号'
          focused={ focused }
          onClick={ () => isFirstIptClick && handleIptClick() }
          onFocus={ this.handleFocus }
          onBlur={ this.handleBlur }
        />
        {
          showClear && <Icon className='clear-phone' type='cross-circle-o' color='rgb(176, 176, 176)' />
        }
        <div className='icon-container' onTouchStart={ this.handleIconClick } />
        <span className='area'>{ curHfArea }</span>
        <PhoneHistory curPhone={ curPhone } phoneHistorys={ phoneHistorys } handlePhoneHistory={ handlePhoneHistory } visibilityHistory={ visibilityHistory } handleClearHistory={ handleClearHistory } />
      </div>
    )
  }
}

const PhoneHistory = ({ curPhone, phoneHistorys = [], handlePhoneHistory, visibilityHistory = '', handleClearHistory }) => {
  // 模拟历史记录，测试时可以打开
  // phoneHistorys = ['182 5500 2974', '182 5510 2974', '182 5200 2974', '182 1500 2974', '182 5566 2974', '182 5591 2974']
  // phoneHistorys = phoneHistorys ? phoneHistorys : []
  const historyREG = new RegExp(`^${ curPhone }`, 'i')
  phoneHistorys = phoneHistorys.filter(item => historyREG.test(item))
  if (phoneHistorys.length > 5) phoneHistorys.splice(5)
  if (phoneHistorys.length > 0) {
    return (
      <ul className='phone-history' style={{ display: visibilityHistory ? 'block' : 'none' }}>
        { phoneHistorys.map(item => (<li key={ item } onClick={ () => handlePhoneHistory(item) }>{ item }</li>)) }
        <li className='clearHistory' onClick={ handleClearHistory } >
          <Icon className='del-icon' type={ require('svg/chongzhi/del.svg') } />
          <span>清空历史记录</span>
        </li>
      </ul>
    )
  }
  return <div />
}

const PayTipsContent = () => (
  <div>
    <h5>如何查充值流量的使用情况？</h5>
    <p>请登录当地运营商的网上营业厅或者拨打当地运营商的客服电话（移动10086，联通10010，电信10000）来查询流量使用详情。</p>
    <h5>充值的流量月底是否清零？</h5>
    <p>是的。</p>
    <h5>流量充值是全国流量还是本地流量</h5>
    <p>全国流量。</p>
    <h5>话费充错号码怎么办</h5>
    <p>
      1）优先自行联系充错的号码，和对方协商能否将资金转回；
      1）若对方号码处于销户状态，请及时联系运营商或联系客服进行处理。若核实充值失败，将为您进行退款。客服热线：<a style={{ fontSize: '.24rem', color: '#666' }} href='tel:4009910008'>4009910008</a>。
    </p>
    <h5>可以给朋友充话费吗</h5>
    <p>可以。个别支付方式会根据您使用环境及历史交易情况综合判定并随时调整您的单笔/日/月充值次数及金额，若您如果发生充值失败的情况，请联系客服咨询具体原因。</p>
  </div>
)
