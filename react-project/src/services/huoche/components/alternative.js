import React from 'react'
import { List, Icon } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'

import '../style/alternative.scss'
import choose from '../img/choose.svg'
import noChoose from '../img/nokong.svg'

const Item = List.Item
// const Brief = Item.Brief

class AlternativeSeat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      choosezuoarr: JSON.parse(JSON.stringify(this.props.haveChooseZuo)),
    }
    this.handleChooseZuo = this.handleChooseZuo.bind(this)
  }
  componentWillUnmount() {
    // Popup.hide()
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
    const { choosezuoarr } = this.state
    const { handlechooseZuowei } = this.props
    let maxprice = 0
    if (choosezuoarr.length > 0) {
      maxprice = choosezuoarr.reduce((i, o) => {
        console.log('test----', i, o)
        if (o.price > i.price) {
          return o
        }
        return i
      }, choosezuoarr[0])
    }
    console.log('max----', maxprice, 'maxprice.price--', maxprice.price)
    setStore('huoche_haveChooseZuo', choosezuoarr, 'session')
    setStore('huoche_maxprice', maxprice.price, 'session')
    setStore('huoche_maxpriceObj', maxprice, 'session')
    handlechooseZuowei(choosezuoarr, maxprice.price, maxprice)
    Mask.closeAll()
    location.hash = ''
  }
  handleChooseZuo(res) {
    let { choosezuoarr } = this.state
    const arr = choosezuoarr.filter(i => { return i.name === res.name })
    // const filter = []
    if (arr.length === 0) {
      choosezuoarr.push(res)
    } else {
      choosezuoarr = choosezuoarr.filter(o => { return o.name !== res.name })
    }
    this.setState({
      choosezuoarr,
    })
  }
  render() {
    const { chooseZuowei, choosezuoarr = [], handleContainerClose } = this.state
    // console.log('chooseZuowei----', chooseZuowei, 'haveChooseZuo---', haveChooseZuo)
    return (
      <div className='alternativeWrap'>
        <div className='title'><span onClick={ () => { this.handleClose(); handleContainerClose() } }>取消</span><span>选择备选坐席</span><span onClick={ () => { this.handleOkchoose(); handleContainerClose() } }>确定</span></div>
        <p>温馨提示：多选几个坐席，抢票成功的成功率会更高！选择后暂收最高票价，出票后视实际情况退还差额。</p>
        <div className='mainZuo'>
          {
            chooseZuowei && chooseZuowei.map(o => (
              <ItemAlter key={ o.price + o.name } res={ o } haveChooseZuo={ choosezuoarr } handleChooseZuo={ this.handleChooseZuo } />
            ))
          }
        </div>
      </div>
    )
  }
}

export default AlternativeSeat

const ItemAlter = ({ res, haveChooseZuo, handleChooseZuo }) => {
  const { name, price } = res
  const arr = haveChooseZuo.filter(i => { return i.name === name })
  // console.log('test-arr', res)
  return (
    <List>
      <Item onClick={ () => handleChooseZuo(res) } extra={ <Icon type={ `${ arr.length > 0 ? choose : noChoose }` } /> }><span className='nameSeat'>{ name }</span><span className='price'>¥{ price }</span></Item>
    </List>
  )
}
