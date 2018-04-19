import React from 'react'
import { get } from '@boluome/common-lib'
import { Listview, Loading, Empty } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'

import EvaluateItem from '../../components/common-component/evaluate-item'

import '../../styles/evaluate/evaluate-info.scss'

export default class EvaluateList extends React.Component {
  constructor(props) {
    super(props)
    const commodityId = location.pathname.split('/')[3]
    const currentFilter = { code: '0', name: '全部' }
    // isFirst: 第一次请求评价接口
    this.state = {
      currentFilter,
      commodityId,
      offset:  0,
      isFirst: true,
    }
    this.getEvaluates = this.getEvaluates.bind(this)
    this.getCommenetApi = this.getCommenetApi.bind(this)
    // this.getCommenetApi({ filter: '0', commodityId }, data => this.setState({ evaluateAllData: data }))
  }
  handleLabelClickMiddleware(currentFilter) {
    this.setState({ currentFilter, offset: 0 })
  }
  getEvaluates(limit, offset, fetchData, onSuccess) {
    this.onSuccess = onSuccess
    const { currentFilter, commodityId, isFirst } = this.state
    const evaluateParas = { filter: currentFilter.code, commodityId, limit: Math.ceil(offset / limit) ? Math.ceil(offset / limit) : 1, offset: limit }
    const callback = data => {
      const evaluateData = data.commodityOrderCommentBos
      onSuccess(evaluateData)
      if (isFirst) {
        this.setState({ evaluateAllData: data, isFirst: false })
      }
      if (evaluateData.length > 0) this.setState({ offset: offset + limit + 1 })
    }
    this.getCommenetApi(evaluateParas, callback)
  }
  getCommenetApi(paras, callback) {
    const closeLoading = Loading()
    const url = '/mall/v1/commodity/comments'
    get(url, paras).then(({ code, data, message }) => {
      if (code === 0) {
        callback(data)
        // 如果第一次，保存所有资料
        // if (isFirst) this.setState({ evaluateAllData: data })
      } else {
        Toast.fail(message)
      }
      closeLoading()
    })
  }
  render() {
    const datas = [
      { code: '0', name: '全部' },
      { code: '1', name: '好评' },
      { code: '2', name: '中评' },
      { code: '3', name: '差评' },
    ]
    const { currentFilter, offset, evaluateAllData } = this.state
    if (evaluateAllData) {
      const { failCommentCount, goodCommentCount, mediumCommentCount, commentCount } = evaluateAllData
      datas[0].num = commentCount
      datas[1].num = goodCommentCount
      datas[2].num = mediumCommentCount
      datas[3].num = failCommentCount
    }
    // if (!evaluateAllData) return <div />
    return (
      <div className='evaluate-info'>
        <ul className='s-label'>
          {
            evaluateAllData &&
            datas.map(item => <li className={ item.code === currentFilter.code ? 'active' : '' } key={ item.code } onClick={ item.code === currentFilter.code ? '' : () => this.handleLabelClickMiddleware(item) }>{ `${ item.name }(${ item.num })` }</li>)
          }
        </ul>
        <div>
          <Listview
            listItem={ <EvaluateItem /> }
            onFetch={ (limit, ofs, fetchData, onSuccess) => this.getEvaluates(limit, ofs, fetchData, onSuccess) }
            limit={ 20 }
            offset={ offset }
            fetchData={{}}
            dataList={ [] }
            noOneComponent={ <Empty selfClass='no-one-component' message='暂无评论～' imgUrl={ require('../../img/no_evaluate.png') } style={{ background: '#f5f5f6' }} /> }
          />
        </div>
      </div>
    )
  }
}
