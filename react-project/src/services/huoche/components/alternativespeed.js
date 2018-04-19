import React from 'react'
import { Icon } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'

import '../style/alternativespeed.scss'
import choose from '../img/choose.svg'
import noChoose from '../img/nokong.svg'
import shan from '../img/shan.png'
import jisu from '../img/jisu.png'
import kuai from '../img/kuaisu.png'
// import disu from '../img/disu.png'

// const Item = List.Item
// const Brief = Item.Brief

class AlternativeSpeed extends React.Component {
  constructor(props) {
    super(props)
    const { maxPrice = 0 } = props
    let speedData = []
    if (maxPrice >= 0 && maxPrice < 50) {
      speedData = [
        {
          Sprice:   30,
          text:     '闪电',
          title:    '闪电',
          Multiple: '100',
          than:     '90%',
          name:     '闪电抢票（¥30/份）',
          pic:      shan,
          clas:     'shan',
        },
        {
          Sprice:   20,
          text:     '极速',
          title:    '极速',
          Multiple: '50',
          than:     '80%',
          name:     '极速抢票（¥20/份）',
          pic:      jisu,
          clas:     'jisu',
        },
        {
          Sprice:   10,
          text:     '快速',
          title:    '快速',
          Multiple: '10',
          than:     '60%',
          name:     '快速抢票（¥10/份）',
          pic:      kuai,
          clas:     'kuaisu',
        },
      ]
    } else {
      speedData = [
        {
          Sprice:   50,
          text:     '闪电',
          title:    '闪电',
          Multiple: '100',
          than:     '90%',
          name:     '闪电抢票（¥50/份）',
          pic:      shan,
          clas:     'shan',
        },
        {
          Sprice:   30,
          text:     '极速',
          title:    '极速',
          Multiple: '50',
          than:     '80%',
          name:     '极速抢票（¥30/份）',
          pic:      jisu,
          clas:     'jisu',
        },
        {
          Sprice:   20,
          text:     '快速',
          title:    '快速',
          Multiple: '10',
          than:     '60%',
          name:     '快速抢票（¥20/份）',
          pic:      kuai,
          clas:     'kuaisu',
        },
      ]
    }
    const channel = getStore('huoche_channel', 'session')
    if (channel && channel === 'tongcheng') {
      speedData = [
        {
          Sprice:   30,
          text:     '极速',
          title:    '极速',
          Multiple: '50',
          than:     '80%',
          name:     '极速抢票（¥30/份）',
          pic:      jisu,
          clas:     'jisu',
        },
        {
          Sprice:   50,
          text:     '闪电',
          title:    '闪电',
          Multiple: '100',
          than:     '90%',
          name:     '闪电抢票（¥50/份）',
          pic:      shan,
          clas:     'shan',
        },
      ]
    }
    const { choosePriceprops = speedData[0].Sprice } = this.props
    const chooseSpeedname = getStore('huoche_chooseSpeedname', 'session') ? getStore('huoche_chooseSpeedname', 'session') : speedData[0].name
    const choosePrice = getStore('huoche_packagePrice', 'session') ? getStore('huoche_packagePrice', 'session') : choosePriceprops
    this.state = {
      ...props,
      speedData,
      choosePrice,
      chooseSpeedname,
    }
    this.handleSpeedData = this.handleSpeedData.bind(this)
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
  // 点击确认将选中的套餐传入到父组件
  handleSpeedFn() {
    const { handleSpeedName } = this.props
    const { chooseSpeedname, choosePrice } = this.state
    handleSpeedName(chooseSpeedname, choosePrice)
    setStore('huoche_packagePrice', choosePrice, 'session')
    setStore('huoche_chooseSpeedname', chooseSpeedname, 'session')
    Mask.closeAll()
    location.hash = ''
  }
  // 选择套餐的数据处理
  handleSpeedData(reply) {
    let { choosePrice, chooseSpeedname } = this.state
    if (reply === 0) {
      choosePrice = 0
      chooseSpeedname = '低速抢票（成功率较低）'
    } else {
      const { Sprice, name } = reply
      choosePrice = Sprice
      chooseSpeedname = name
    }
    // console.log('handleSpeedData---', choosePrice, chooseSpeedname)
    this.setState({
      choosePrice,
      chooseSpeedname,
    })
  }
  render() {
    const { speedData, choosePrice } = this.state
    // console.log('choosePrice---', choosePrice)
    // const { text, Multiple, than, Sprice } = speedData
    return (
      <div className='alternativeSpeedWrap'>
        <div className='alternativeMain'>
          <p>选择加速通道，抢票快人一步。如果抢不到，套餐全额退还至您的支付账号。</p>
          <div className='speedWrap'>
            {
              speedData.map(i => (
                <ItemCom key={ i.text } i={ i } handleSpeedData={ this.handleSpeedData } choosePrice={ choosePrice } />
              ))
            }
          </div>
        </div>
        <div className='okBtn' onClick={ () => this.handleSpeedFn() }>确定</div>
      </div>
    )
  }
}

export default AlternativeSpeed

// <Item
//   multipleLine
//   onClick={ () => this.handleSpeedData(0) }
//   extra={ <Icon type={ choosePrice === '0' || choosePrice === 0 ? choose : noChoose } /> }
//   className='disuItem'
// >
//   <img className='disuPic' src={ disu } alt='' /><span className='title'>低速抢票</span><span className='tip'>（成功率较低）</span>
// </Item>

const ItemCom = ({ i, handleSpeedData, choosePrice }) => {
  const { Sprice, text, Multiple, than, pic, clas } = i
  // console.log('iSprice--', Sprice, i)
  return (
    <div className='speedItem' onClick={ () => handleSpeedData(i) }>
      <div className='name'><img className='ItemPic' src={ pic } alt='' /><span className={ `title ${ clas }` }>{ `${ text }抢票` }</span><span className='priceS'>{ `¥${ Sprice }/份` }</span><span className='iconChoose'><Icon type={ Number(choosePrice) === Sprice ? choose : noChoose } /></span></div>
      <div className='Multiple'>{ `${ Multiple }倍加速；` }</div>
      <div className='than'>{ `抢票速度超越${ than }用户；` }</div>
      <div className='tip'>{ `${ text }刷票自动抢。` }</div>
    </div>
  )
}

// <Item
//   key={ i.than }
//   multipleLine
//   onClick={ () => this.handleSpeedData(i) }
//   className='speedItem'
//   extra={ <Icon type={ choosePrice === i.Sprice ? choose : noChoose } /> }
// >
//   { `${ i.title }抢票 （¥${ i.Sprice }／份）` }<Brief>{ `${ i.Multiple }倍加速；` }<br /> { `抢票速度超越${ i.than }用户；` }<br />{ `${ i.text }刷票自动抢。` }</Brief>
// </Item>
