import React from 'react'
import { List } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'

import NoticeMask from './NoticeMask'
import '../style/ordernotice.scss'

const Item = List.Item
class Ordernotice extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    this.state = {
      ...props,
    }
    this.handleNoticeShow = this.handleNoticeShow.bind(this)
  }
  componentWillUnmount() {
    // const node = document.getElementsByClassName('mask-container')
    // if (node.length > 0) {
    //   node[0].remove()
    // }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  handleNoticeShow() {
    Mask(<NoticeMask />, { mask: false, style: { position: 'absolute' } })
  }
  render() {
    const { seatsChoose, status = -10 } = this.state
    return (
      <div>
        {
          seatsChoose && seatsChoose.name && status !== 4 ? (<Item extra={ <NoticeBtn handleNoticeShow={ this.handleNoticeShow } /> }>{ seatsChoose.name } ¥{ seatsChoose.price }</Item>) :
          (
            status === 4 ? (<Item arrow='horizontal' onClick={ () => { this.handleNoticeShow() } }><span className='noticeBtn'>预定须知</span></Item>) : (<Item className='gaitui' arrow='horizontal' extra={ <NoticeBtn handleNoticeShow={ this.handleNoticeShow } /> } />)
          )
        }
      </div>
    )
  }
}

export default Ordernotice

const NoticeBtn = ({ handleNoticeShow }) => (
  <span className='noticeBtn' onClick={ () => { handleNoticeShow() } }>预定须知</span>
)
