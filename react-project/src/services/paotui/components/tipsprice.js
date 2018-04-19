import React from 'react'
import { Slider, createTooltip, List, Popup } from 'antd-mobile'
import WriteText from './writetext.js'

import '../style/tipsprice.scss'

const SliderWithTooltip = createTooltip(Slider)
const Item = List.Item
class Tipsprice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      val: 0,
    }
    // console.log('ContactList-----', props)
    this.handleChangeTips = this.handleChangeTips.bind(this)
    this.handleWriteTips = this.handleWriteTips.bind(this)
  }
  componentWillUnmount() {
    // Mask.closeAll()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  // 当选择了收货地址之后的事件
  handleChangeTips(v) {
    const { onChange } = this.props
    const vl = Number(v)
    onChange(vl)
    this.setState({
      tipsPrices: vl,
    })
  }
  handleWriteTips() {
    Popup.show(<WriteText onChange={ this.handleChangeTips } />, {
      animationType: 'slide-up',
      // maskProps:     { className: 'am-popup-mask myselfam-popup-mask' },
      onMaskClose:   this.onMaskClose,
    })
  }
  render() {
    const { tipsPrices = 0 } = this.state
    return (
      <div className='tipsPrice'>
        <List>
          <Item extra={
            <div className='iconWrapper'>
              <SliderWithTooltip min={ 0 } max={ tipsPrices > 20 ? tipsPrices : 20 } defaultValue={ tipsPrices > 20 ? 20 : tipsPrices } value={ tipsPrices } onChange={ this.handleChangeTips } />
            </div>
          }
          >
            小费 <span className='tipsPriceSpan'>{ tipsPrices }元</span>
            <span className='moreSpan' onClick={ () => this.handleWriteTips() }>更多</span>
          </Item>
          <Item className='tipsTextPrice'>支付小费后配送员会更及时接单，得到更优质的服务</Item>
        </List>
      </div>
    )
  }
}
export default Tipsprice
