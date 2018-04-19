import React from 'react'
// import { Icon } from 'antd-mobile'
// import { Mask } from '@boluome/oto_saas_web_app_component'

import '../style/ordernotice.scss'
import closeIcon from '../img/close.png'

class NoticeMask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
  }
  componentWillUnmount() {
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  render() {
    const { handleContainerClose } = this.props
    return (
      <div className='noticeMaskwrap'>
        <div className='noticeMask'>
          <p>1、声明</p>
          <div>本产品内含火车票，受全国各铁路局的不同规定与要求，无法承诺百分之百都能预订成功</div>
          <p>2、取票方式</p>
          <div>凭购票时的有效证件和电子取票号，可在全国任意火车站或代售点取票。代售点收取代售费5元/张，车站售票窗口取异地票收取费用5元/张，车站取票机不收取任何费用。</div>
          <p>3、退票</p>
          <div>
            <h3 style={{ fontWeight: 'normal', textIndent: '20px', fontSize: '.26rem', color: '#000', margin: '10px' }}>网上退票</h3>
            <ul>
              <li>代购成功，未取票且距发车时间大于1小时，可在“我的订单”中申请网上退票</li>
              <li>申请退票后，卖家1小时内帮您退票</li>
              <li>根据退票时间，铁路局收取5%-20%的退票服务费；建议您尽早提交退票申请，减少手续费损失。（对开车前15天以上（不含）退票的，不收取退票费。票面乘车站开车时间开车前15天（含）至48小时以上的按票价5%收取手续费；距离发车时间48小时（含）以内、24小时以上的，收取10%退票费；距离发车时间不足24小时（含）的，收取20%退票费，根据2015年6月10日新规，距发车时间15天以内的车票，改签到15以上的，退票时收取5%退票费；最终以铁路局实退为准。）</li>
              <li>退票成功后，退还款项（含保险）即刻退回您的支付账户。</li>
              <li>铁路局规定退票手续费最少收取2元，因此票面价低于2元钱的车票，退票后退款为0元。</li>
            </ul>
            <h3 style={{ fontWeight: 'normal', textIndent: '20px', fontSize: '.26rem', color: '#000', margin: '10px' }}>车站退票</h3>
            <ul>
              <li>代购成功，已换取实体票或距离发车时间小于1小时，需您携带购票时有效证件和火车票，前往全国任意火车站退票窗口办理退票。退还款项将在7-20个工作日内退回您的支付宝账户。发车后窗口也无法操作退票，该票只能作废。</li>
              <li>如果您购买了交通意外险，窗口退票成功后，请尽快联系卖家为您撤保，退还款项将在7-20个工作日内退回您的支付宝账户。如果没有及时通知，保险将按原车次生效，后果由买家自行承担。</li>
            </ul>
          </div>
          <p>4、改签</p>
          <div>
            <ul>
              <li>代购成功，未取票且距发车时间大于1小时，可在“我的订单”中申请网上改签；线下改签，可去售票处改签；</li>
              <li>改签申请后，系统会在1小时内处理改签申请；如申请通过则改签成功；</li>
              <li>改签后的新车票票价低于原车票的，旅客需要重新支付新票全额票款，原票款在规定时间退回支付账户中。新车票票价高于或等于原车票的，旅客无需另外支付，产生差额将在规定时间退回支付账户中。火车票改签是免费的，并且每张车票只有一次改签的机会，因此改签时需谨慎哦；</li>
              <li>原车票卧铺车票改签只能一张一张改，暂不支持批量改签；</li>
              <li>开车前48小时～15天期间内，改签至距开车15天以上的其他列车，又在距开车15天前退票的，仍核收5%的退票费。改签后的车票乘车日期在春运期间的，退票时一律按开车时间前不足24小时标准核收退票费。</li>
            </ul>
          </div>
        </div>
        <img onClick={ () => { handleContainerClose() } } src={ closeIcon } alt='' />
      </div>
    )
  }
}

export default NoticeMask
