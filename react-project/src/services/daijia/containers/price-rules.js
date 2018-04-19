import React from 'react'
import { parseQuery } from '@boluome/common-lib'

import '../styles/price-rules.scss'

import { getPriceRules } from '../actions/price-rules'

export default class PriceRules extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: '',
    }
    this.startPoint = JSON.parse(parseQuery(window.location.search).paras)
  }
  componentWillMount() {
    const callback = data => {
      const { priceList } = data
      const dataList = [
        {
          title: '价格表',
          list:  priceList.map(o => ({ text1: `${ o.startTime }-${ o.endTime }`, text2: `${ o.basicPrice }元`, text3: '（含10公里）' })),
        },
        {
          title: '起步价',
          list:  [{ text1: '以实际开车的时间为准' }],
        },
        {
          title: '里程费',
          list:  [{ text1: '基础代驾距离为10公里每超过10公里需收20元不满则按照10公里计算' }],
        },
        {
          title: '等候费',
          list:  [{ text1: '免费等候时间为15分钟每超过15分钟需收10元不满则按照15分钟计算' }],
        },
      ]
      this.setState({ dataList })
    }
    getPriceRules(this.startPoint, callback)
  }
  render() {
    const { dataList } = this.state
    const { city } = this.startPoint
    if (!dataList) return <div />
    return (
      <div className='price-rules'>
        <h1 className='city'>
          <span>{ `e代驾 - ${ city }` }</span>
        </h1>
        {
          dataList.map(o => <Item dataList={ o } key={ o.title } />)
        }
      </div>
    )
  }
}

const Item = ({ dataList }) => {
  const { title, list } = dataList
  return (
    <div className='price-rules-item'>
      <p className='title'>{ title }</p>
      <ul className='list'>
        {
          list.map(o => (
            <li key={ o.text1 }>
              <span>{ o.text1 }</span>
              <span>{ o.text2 }</span>
              <span>{ o.text3 }</span>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
