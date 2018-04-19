import React from 'react'
// import { Icon } from 'antd-mobile'
// import { Mask } from '@boluome/oto_saas_web_app_component'

import '../style/AccidentRistMask.scss'
import closeIcon from '../img/close.png'

class AccidentRistMask extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    this.state = {
      ...props,
    }
    // this.handleNoticeShow = this.handleNoticeShow.bind(this)
  }
  componentWillUnmount() {
    // Popup.hide()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  // // 获取保险数据
  // getAccidentRist() {
  //
  // }
  render() {
    const { handleContainerClose } = this.props
    const { accidentData } = this.state
    console.log('accidentData---', accidentData)
    const { name = '' } = accidentData // detail
    return (
      <div className='AccidentRistMask'>
        <div className='title'>{ name }</div>
        <div className='details'>
          <p>在保险期间内，被保险人每次以乘客身份乘坐铁路公共交通工具时遭受意外伤害事故导致身故、
          残疾的，保险公司将根据保单约定给付意外身故、残疾保险金。铁路公共交通工具指领有合法的公共运输营业执照，
          以公共运输为目的，被保险人以乘客身份需要付款乘坐的铁路机动运输工具，包括火车、轨道列车。</p>
        </div>
        <img onClick={ () => { handleContainerClose() } } src={ closeIcon } alt='' />
      </div>
    )
  }
}

// {
//   detail.map(i => (
//     <p key={ i }>{ i }</p>
//   ))
// }

// <p>1、声明</p>
// <div>保险名称：《公共交通工具意外伤害保险（2014版）》</div>
// <p>2、取票方式</p>
// <div>保险有效期： 本产品保险期间： 当次列车有效，被保险人以乘客身份乘坐从事赢客运的列车期间
// （自持有效车票检票进入车厢时起，至抵达车票载明的终点离开所乘客运火车车厢时止）</div>
// <p>3、网上退票</p>
// <div>保险责任：火车意外伤害保险最高赔付50万元人民币（按中国保监会规定，
// 10周岁及以下的未成年人累计身故保险金额不得超过人民币20万元；11至17周岁的未成年人累计身故保险金额不得超过人民币50万元。
// 若未成年被保险人的保险金额超过上述规定，则以上述规定的保险金额为限。）</div>
// <img onClick={ () => { Mask.closeAll() } } src={ closeIcon } alt='' />

export default AccidentRistMask
