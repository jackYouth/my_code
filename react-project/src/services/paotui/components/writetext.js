import React from 'react'
import { List, Popup, InputItem, NoticeBar } from 'antd-mobile'

import '../style/tipsprice.scss'

class WriteText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      mark: true,
    }
    // console.log('ContactList-----', props)
    this.Okbtn = this.Okbtn.bind(this)
    this.handleTipsPrice = this.handleTipsPrice.bind(this)
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
  handleChangeTips() {
    console.log('contact')
  }
  onClose() {
    Popup.hide()
  }
  Okbtn() {
    const { val } = this.state
    const { onChange } = this.props
    if (val > 0 && val <= 100) {
      this.setState({
        mark: true,
      })
      onChange(val)
      Popup.hide()
    } else {
      this.setState({
        mark: false,
      })
    }
  }
  handleTipsPrice(val) {
    if (val > 0 && val <= 100) {
      this.setState({
        val,
        mark: true,
      })
    } else {
      this.setState({
        val,
        mark: false,
      })
    }
  }
  render() {
    const { mark } = this.state
    return (
      <div className='tipspriceMain'>
        <div className='header'>
          <span className='close' onClick={ () => this.onClose() }>取消</span>
          <span className='tips'>小费</span>
        </div>
        {
          mark ? ('') : (<NoticeBar className='tipspriceNotice' mode='link'>输入的小费范围要在1-100 之间</NoticeBar>)
        }
        <div className='content'>
          <List>
            <InputItem
              placeholder='金额元 (元) 可输入1 - 100'
              maxLength={ 3 }
              type='phone'
              onChange={ v => this.handleTipsPrice(v) }
            />
          </List>
          <div className='btn' onClick={ () => this.Okbtn() }>确定</div>
        </div>
      </div>
    )
  }
}
export default WriteText
