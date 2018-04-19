import React, { Component } from 'react'
import { getStore, parseQuery } from '@boluome/common-lib'
import { Listview, Loading } from '@boluome/oto_saas_web_app_component'
import { Flex, List, Toast } from 'antd-mobile'
import { get } from 'business'
import { merge } from 'ramda'

import GoodItem from './common-component/good-item'
import NoOneComponent from './common-component/no-one-component'
import '../styles/business.scss'

const FItem = Flex.Item
const LItem = List.Item

export default class Business extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offset:                    0,
      currentCategoryIndex:      0,
      currentIndustryCategoryId: 0,
    }
    this.handleFetchDataMid = this.handleFetchDataMid.bind(this)
    this.handleFilterClickMiddleware = this.handleFilterClickMiddleware.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    const { businessData } = nextProps
    let { currentIndustryCategoryId } = this.state
    if (!currentIndustryCategoryId && businessData && businessData.industryCategoryBoList) {
      currentIndustryCategoryId = businessData.industryCategoryBoList[0].industryCategoryId
      this.setState({ currentIndustryCategoryId })
    }
  }
  handleFetchDataMid(limit, offset, fetchData, onSuccess) {
    const closeLoading = Loading()
    const brandId = parseQuery(location.search).brandId
    const { currentIndustryCategoryId } = this.state
    if (currentIndustryCategoryId || currentIndustryCategoryId === 0) {
      this.onSuccess = onSuccess
      let paras = {
        brandId,
        limit:              Math.ceil(offset / limit) ? Math.ceil(offset / limit) : 1,
        offset:             limit,
        industryCategoryId: Array.isArray(currentIndustryCategoryId) ? 0 : currentIndustryCategoryId,
      }
      const selectedCity = getStore('selectedCity', 'session')
      const { longitude, latitude, city, county } = selectedCity
      paras = merge(paras)({ longitude, latitude, city, county })
      get('/daojia/v1/brand/services', paras).then(({ code, data, message }) => {
        if (code === 0) {
          const currentServiceVoList = data.serviceVoList
          onSuccess(currentServiceVoList)
          if (currentServiceVoList.length > 0) this.setState({ offset: this.state.offset + limit + 1 })
        } else {
          Toast.fail(message, 1)
        }
        closeLoading()
      })
    }
  }
  handleFilterClickMiddleware(currentCategoryIndex, industryCategoryBoList) {
    const currentIndustryCategoryId = industryCategoryBoList[currentCategoryIndex].industryCategoryId
    this.setState({ currentIndustryCategoryId, currentCategoryIndex, offset: 0 })
    // this.handleFetchDataMid(20, 0, {}, this.onSuccess, currentIndustryCategoryId)
  }

  render() {
    const { businessData, handleToAllComment, handleGoodClick } = this.props
    const { offset, currentCategoryIndex } = this.state
    return (
      <Listview
        listItem={ <GoodItem onClick={ handleGoodClick } /> }
        onFetch={ this.handleFetchDataMid }
        limit={ 20 }
        offset={ offset }
        topComponent={ <TopComponent { ...{ businessData, handleToAllComment, currentCategoryIndex, handleFilterClickMiddleware: this.handleFilterClickMiddleware } } /> }
        fetchData={{}}
        noOneComponent={ <NoOneComponent /> }
      />
    )
  }
}

const TopComponent = ({ businessData, handleToAllComment, currentCategoryIndex, handleFilterClickMiddleware }) => {
  if (!businessData) return <div />
  const { publicityImg, brandName, smallLogoImg, brandSlogan, serviceCount, goodCommentCount, industryCategoryBoList } = businessData
  return (
    <div className='business'>
      <div className='header'>
        <img className='banner-img' src={ publicityImg } alt={ brandName } />
        <div className='brand-info'>
          <img src={ smallLogoImg } alt={ brandName } />
          <div className='right'>
            <h1>{ brandName }</h1>
            <p>{ brandSlogan }</p>
          </div>
        </div>
        <Flex className='brand-num'>
          <FItem className='server-count'>
            <p className='top'>{ serviceCount }</p>
            <p className='bottom'>服务次数</p>
          </FItem>
          <FItem className='good-comment-count'>
            <p className='top'>{ goodCommentCount }</p>
            <p className='bottom'>好评数</p>
          </FItem>
        </Flex>
      </div>
      <LItem className='user-comment' arrow='horizontal' extra='查看全部' onClick={ () => handleToAllComment(businessData) }>
        用户评价
      </LItem>
      <div className='good-list'>
        <ul className='s-label'>
          {
            industryCategoryBoList.map((item, index) => <li className={ index === currentCategoryIndex ? 'active' : '' } key={ item.industryCategoryId } onClick={ () => { if (index !== currentCategoryIndex) handleFilterClickMiddleware(index, industryCategoryBoList) } }>{ item.industryCategoryName }</li>)
          }
        </ul>
      </div>
    </div>
  )
}
