import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { parseQuery, getStore } from '@boluome/common-lib'
import { Evaluation, Loading } from '@boluome/oto_saas_web_app_component'
import { send } from 'business'
import { TextareaItem, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'

import PictureUpload from './common-component/picture-upload'

import '../styles/user-comment.scss'

export default createForm()(
  class UserComment extends Component {
    constructor(props) {
      super(props)
      this.state = {
        score: 5,
        level: '好',
      }
      this.handleChangeImg = this.handleChangeImg.bind(this)
    }
    handleSelectStar(score) {
      score = score.split('%')[0] / 20
      let level = '差'
      if (score > 1 && score <= 3) level = '中'
      if (score > 3) level = '好'
      this.setState({ level, score })
    }
    handleCommit(paras) {
      const closeLoading = Loading()
      send('/daojia/v1/order/comment', paras).then(({ code, message }) => {
        if (code === 0) {
          browserHistory.push(`/daojia/comment-info?serviceId=${ parseQuery(location.search).serviceId }`)
        } else {
          Toast.fail(message)
        }
        closeLoading()
      })
    }
    handleCommentChange(comment) {
      if (comment.length >= 120) Toast.info('最多输入120个字符')
      this.setState({ comment })
    }
    handleChangeImg(imgs) {
      this.setState({ imgs })
    }
    render() {
      const { level, score, comment = '', imgs = [] } = this.state
      const { form } = this.props
      const { getFieldProps } = form
      const orderId = parseQuery(location.search).orderId
      const orderType = parseQuery(location.search).orderType
      const brandImage = parseQuery(location.search).brandImage
      const serviceId = parseQuery(location.search).serviceId
      const userId = getStore('customerUserId', 'session')
      const paras = {
        orderId,
        orderType,
        serviceId,
        userId,
        score,
        comment,
        imgs: imgs.map(o => o.url),
      }
      return (
        <div className='user-comment'>
          <div className='header'>
            <img className='user-icon' src={ brandImage } alt='user-comment' />
            <Evaluation selfClass='test' integerMode={ 1 } defaultValue={ `${ score / 0.05 }%` } width={ '2rem' } handleSelectStar={ i => this.handleSelectStar(i) } />
            <p>{ level }</p>
          </div>
          <TextareaItem
            {
              ...getFieldProps('count')
            }
            rows={ 3 }
            count={ 120 }
            value={ comment }
            placeholder='服务满意吗？说说此次上门服务之后的感受吧~'
            onChange={ i => this.handleCommentChange(i) }
          />
          <PictureUpload handleChangeImg={ this.handleChangeImg } imgs={ imgs } />
          <p className='commit' onClick={ () => this.handleCommit(paras) }>发布评价</p>
        </div>
      )
    }
  }
)
