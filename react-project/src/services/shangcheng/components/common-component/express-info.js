import React from 'react'

import '../../styles/comment-component/express-info.scss'

import { getExpressList } from '../../actions/refund/refund-info'

export default class ExpressInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expressInfo: '',
    }
    this.getList = this.getList.bind(this)
  }
  componentWillMount() {
    const { orderId } = this.props
    getExpressList(orderId, this.getList)
  }
  getList(expressInfo) {
    this.setState({ expressInfo })
  }
  render() {
    let { expressInfo } = this.state
    if (!expressInfo) expressInfo = [1, 2, 3, 4, 5].map(o => ({ time: '时间1285451', context: `内容啊阿贾克斯队话费卡绝世说地方${ o }` }))
    return (
      <div className='express-info'>
        <div className='header'>
          <p>
            <img src='' alt='商品图片' />
            <span>待正式下单</span>
          </p>
          <p>
            <span>承运来源：待正式下单</span>
            <span>预计送达：待正式下单</span>
            <span>联系电话：待正式下单</span>
          </p>
        </div>
        <ul className='express-info-list'>
          {
            expressInfo.map((o, i) => {
              return (
                <li key={ o.context } className={ i === 0 ? 'active' : '' }>
                  <p>
                    <span className='active'><span /></span>
                    <span className='unActive' />
                  </p>
                  <p>
                    <span>{ o.context }</span>
                    <span>{ o.time }</span>
                  </p>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
