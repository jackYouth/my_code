import React from 'react'
import { parseQuery, getStore } from '@boluome/common-lib'
import { Listview, Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from 'business'
import { merge } from 'ramda'

import CommentItem from './common-component/comment-item'
import NoOneComponent from './common-component/no-one-component'

import '../styles/comment-info.scss'

export default class CommentInfo extends React.Component {
  constructor(props) {
    super(props)
    const brandCode = parseQuery(location.search).brandCode
    const brandId = parseQuery(location.search).brandId
    const serviceId = parseQuery(location.search).serviceId
    const currentLabel = { score: 'all', name: '全部' }
    this.state = {
      currentLabel,
      brandCode,
      brandId,
      serviceId,
      offset: 0,
    }
    this.getComments = this.getComments.bind(this)
    this.getCommenetApi = this.getCommenetApi.bind(this)
    this.getCommenetApi({ score: 'all', limit: 1, offset: 20 }, data => this.setState({ commentAllData: data }))
  }

  handleLabelClickMiddleware(currentLabel) {
    this.setState({ currentLabel, offset: 0 })
  }
  getComments(limit, offset, fetchData, onSuccess) {
    this.onSuccess = onSuccess
    const { currentLabel } = this.state
    const commentParas = { score: currentLabel.score, limit: Math.ceil(offset / limit) ? Math.ceil(offset / limit) : 1, offset: limit }
    const callback = data => {
      const commentData = data.commentData
      onSuccess(commentData)
      if (commentData.length > 0) this.setState({ offset: offset + limit + 1 })
    }
    this.getCommenetApi(commentParas, callback)
  }
  getCommenetApi(paras, callback) {
    const closeLoading = Loading()
    const { brandCode, brandId, serviceId } = this.state
    let url = '/daojia/v1/brand/comments'
    if (serviceId) {
      url = '/daojia/v1/service/comments'
      const industryCode = getStore('industryCode', 'session')
      paras = merge(paras)({ industryCode, serviceId })
    } else {
      paras = merge(paras)({ brandCode, brandId })
    }
    get(url, paras).then(({ code, data, message }) => {
      if (code === 0) {
        callback(data)
        // 如果第一次，保存所有资料
        // if (isFirst) this.setState({ commentAllData: data })
      } else {
        Toast.fail(message)
      }
      closeLoading()
    })
  }
  render() {
    const { currentLabel, offset, commentAllData } = this.state
    if (!commentAllData) return <div />
    const datas = [
      { score: 'all', name: '全部' },
      { score: 'good', name: '好评' },
      { score: 'medium', name: '中评' },
      { score: 'fail', name: '差评' },
    ]
    if (commentAllData) {
      const { failComment, goodComment, mediumComment, total } = commentAllData
      datas[0].num = total
      datas[1].num = goodComment
      datas[2].num = mediumComment
      datas[3].num = failComment
    }
    console.log(commentAllData)
    const { commentData = [] } = commentAllData
    return (
      <div className='comment-info'>
        <ul className='s-label'>
          {
            datas.map(item => <li className={ item.score === currentLabel.score ? 'active' : '' } key={ item.score } onClick={ item.score === currentLabel.score ? '' : () => this.handleLabelClickMiddleware(item) }>{ `${ item.name }(${ item.num })` }</li>)
          }
        </ul>
        {
          commentData.length === 0
          ? <NoOneComponent />
          : <div>
            <Listview
              listItem={ <CommentItem /> }
              onFetch={ this.getComments }
              limit={ 20 }
              offset={ offset }
              fetchData={{}}
              dataList={ commentData }
              noOneComponent={ <NoOneComponent /> }
            />
          </div>
        }
      </div>
    )
  }
}
