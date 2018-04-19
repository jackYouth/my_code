import React from 'react'
import { List, Icon } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'
// import { setStore } from '@boluome/common-lib'

import '../style/alternative.scss'
import choose from '../img/choose.svg'
import noChoose from '../img/nokong.svg'

const Item = List.Item
// const Brief = Item.Brief

class StopTime extends React.Component {
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
  // 取消选择被选坐席
  handleClose() {
    Mask.closeAll()
    location.hash = ''
  }
  // 点击确认将选中的坐席传入到父组件
  handleOkchoose() {
    Mask.closeAll()
    location.hash = ''
  }
  render() {
    const { handleContainerClose } = this.state
    return (
      <div className='alternativeWrap'>
        <div className='title'><span onClick={ () => { this.handleClose(); handleContainerClose() } }>取消</span><span>选择备选坐席</span><span onClick={ () => { this.handleOkchoose(); handleContainerClose() } }>确定</span></div>
        <p>温馨提示：多选几个日期，抢票成功的记录会更高！</p>
        <List>
          <Item extra={ <Icon type={ choose } /> }>10月15日<span className='time'>周日</span></Item>
        </List>
        <List>
          <Item extra={ <Icon type={ choose } /> }>10月16日<span className='time'>周一</span></Item>
        </List>
        <List>
          <Item extra={ <Icon type={ noChoose } /> }>10月17日<span className='time'>周二</span></Item>
        </List>
        <List>
          <Item extra={ <Icon type={ noChoose } /> }>10月18日<span className='time'>周三</span></Item>
        </List>
      </div>
    )
  }
}

export default StopTime
