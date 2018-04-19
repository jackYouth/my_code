import React, { Component } from 'react'
import { List, WhiteSpace, TextareaItem, Button } from 'antd-mobile'
import { createForm } from 'rc-form'
import { setStore, getStore } from '@boluome/common-lib'
import '../style/orderTips.scss'

// 订单备注页组件
class OrderTipstest extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    const tipsArr = getStore('tipsArr')
    const userTips = getStore('userTips')
    const currUser = getStore('customerUserId', 'session')
    if (tipsArr && userTips === currUser) {
      // console.log('yes!!!!!!')
    } else {
      // console.log('no!!!!!!!')
      setStore('tipsArr', [])
    }
  }

  handleFastTips(item) {
    const { fastTipsArr = [] } = this.state
    // let fastTipsArr = this.state
    // console.log('fastTipsArr', fastTipsArr)
    if (fastTipsArr.filter(i => { return i === item }).length > 0) {
      fastTipsArr.forEach((curritem, index) => {
        if (curritem === item) {
          fastTipsArr.splice(index, 1)
        }
      })
    } else {
      fastTipsArr.push(item)
    }

    this.setState({ fastTipsArr })
    // console.log('fastTipsArr', fastTipsArr)
  }

  handleBtnClick() {
    const { tips, fastTipsArr = [] } = this.state
    const { handleTips } = this.props
    const tipsArr = !getStore('tipsArr') ? [] : getStore('tipsArr')

    if (tipsArr.length <= 9) {
      tipsArr.push(tips)
      if (tips) {
        setStore('userTips', getStore('customerUserId', 'session'))
        setStore('tipsArr', [...new Set(tipsArr)])
      }
    } else {
      tipsArr.shift()
      tipsArr.push(tips)
      if (tips) {
        setStore('userTips', getStore('customerUserId', 'session'))
        setStore('tipsArr', [...new Set(tipsArr)])
      }
    }
    fastTipsArr.push(tips)
    handleTips(fastTipsArr)
    this.props.handleContainerClose()
  }

  render() {
    const { getFieldProps } = this.props.form
    const tipsArr = getStore('tipsArr') ? getStore('tipsArr') : []
    const { fastTipsArr = [] } = this.state
    // console.log('fastTipsArr', fastTipsArr)
    return (
      <div className='orderTips-container'>
        <div className='fast-tips' style={{ display: tipsArr.length > 0 ? 'block' : 'none' }}>
          <p>快速备注</p>
          {
            tipsArr.length > 0 ?
              tipsArr.map(item => {
                return (
                  <span key={ `tipsArrKey${ Math.random() }` } onClick={ () => { this.handleFastTips(item) } }
                    className={
                      fastTipsArr.filter(fastItem => {
                        // console.log('item', item, fastItem)
                        return item === fastItem
                      }).length > 0 ? 'chooseFastTip' : ''
                    }
                  >{ item }</span>
                )
              })
            : ''
          }
        </div>
        <WhiteSpace />
        <div className='tips-main-box'>
          <span className='tips-main-title'>其他备注</span>
          <List className='tips-box'>
            <TextareaItem
              { ...getFieldProps('count', {}) }
              placeholder={ '请输入备注内容（可不填）' }
              rows={ 5 }
              count={ 50 }
              value={ this.state.tips }
              onChange={ e => this.setState({ tips: e }) }
            />
          </List>
        </div>
        <div className='btn-container'>
          <Button className='btn' type='primary'
            style={{ margin: '.5rem auto', width: '90%', backgroundColor: '#ff9a00', border: '0' }}
            onClick={ () => this.handleBtnClick() }
          >确定</Button>
        </div>
      </div>
    )
  }
}

const OrderTips = createForm()(OrderTipstest)

export default OrderTips
