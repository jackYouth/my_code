import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { getStore, setStore } from '@boluome/common-lib'
import { Empty } from '@boluome/oto_saas_web_app_component'
import { send } from 'business'
import { Grid, Toast } from 'antd-mobile'

import GoodItem from './common-component/good-item'
import DefaultBottom from './index-search-components/default-bottom'

import '../styles/index-search.scss'

export default class IndexSearch extends Component {
  constructor(props) {
    super(props)
    this.state = { searchValue: '' }
    this.handleHistoryClick = this.handleHistoryClick.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleBusinessClick = this.handleBusinessClick.bind(this)
    this.handleGoodClick = this.handleGoodClick.bind(this)
  }
  inputChange(searchValue) {
    searchValue = searchValue.target.value
    this.setState({ searchValue })
    if (searchValue.length > 0) {
      // 当500s内第二次触发了input的onchange事件，则取消上一个搜索的定时器，重新设定一个
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.handleSearch(searchValue), 500)
    }
  }
  handleSearch(searchParam) {
    const industryCode = getStore('industryCode', 'session')
    const selectedCity = getStore('selectedCity', 'session')
    const paras = {
      limit:   1,
      offset:  10,
      mapType: 'gaode',
      searchParam,
      industryCode,
      ...selectedCity,
    }
    send('/daojia/v1/resources', paras).then(({ code, data, message }) => {
      if (code === 0) {
        this.setState({ searchResult: data })
        let searchHistorys = getStore(`${ industryCode }_searchHistorys`) ? getStore(`${ industryCode }_searchHistorys`) : []
        searchHistorys = searchHistorys.filter(i => i !== searchParam)
        searchHistorys.unshift(searchParam)
        setStore(`${ industryCode }_searchHistorys`, searchHistorys)
      } else {
        Toast.fail(message)
      }
    })
  }
  handleHistoryClick(searchValue) {
    this.handleSearch(searchValue)
    this.setState({ searchValue })
  }
  handleBusinessClick(res) {
    const { id } = res
    const channel = getStore('channel', 'session')
    browserHistory.push(`/daojia/${ channel }/business?brandId=${ id }`)
  }
  handleGoodClick(res) {
    const { serviceId } = res
    const industryCode = getStore('industryCode', 'session')
    browserHistory.push(`/daojia/${ industryCode }/detail?serviceId=${ serviceId }`)
  }
  render() {
    const { searchValue, searchResult } = this.state
    return (
      <div className='index-search'>
        <div className='header'>
          <div className='search-main'>
            <input value={ searchValue } placeholder='请输入搜索内容' onChange={ value => this.inputChange(value) } type='text' />
          </div>
          <Cancel />
        </div>
        {
          !searchResult &&
          <DefaultBottom { ...{ handleHistoryClick: this.handleHistoryClick } } />
        }
        {
          searchResult && searchResult.brandData.length === 0 && searchResult.serviceData.length === 0 &&
          <Empty message='没找到服务和品牌' imgUrl={ require('../img/no_data.png') } style={{ background: '#f5f5f6', height: 'calc(100% - 1rem)' }} />
        }
        {
          searchResult && (searchResult.brandData.length !== 0 || searchResult.serviceData.length !== 0) &&
          <SearchResultBottom { ...{ searchResult, handleBusinessClick: this.handleBusinessClick, handleGoodClick: this.handleGoodClick } } />
        }
      </div>
    )
  }
}

const SearchResultBottom = ({ searchResult, handleBusinessClick, handleGoodClick }) => {
  const { serviceData } = searchResult
  let { brandData } = searchResult
  brandData = brandData.map(item => ({ icon: item.bigLogoImg, text: item.brandName, id: item.brandId }))
  return (
    <div className='search-result'>
      {
        brandData.length > 0 &&
        <p className='title'>品牌</p>
      }
      {
        brandData.length > 0 &&
        <Grid data={ brandData } onClick={ res => handleBusinessClick(res) } />
      }
      {
        serviceData.length > 0 &&
        <p className='title'>服务</p>
      }
      {
        serviceData.length > 0 &&
        serviceData.map(item => <GoodItem key={ item.serviceId } { ...{ data: item, onClick: handleGoodClick } } />)
      }
    </div>
  )
}


const cancelStyle = {
  fontSize:  '0.28rem',
  color:     '#ffab00',
  display:   'inline-block',
  width:     '15%',
  textAlign: 'center',
}
const Cancel = () => <span style={ cancelStyle } onClick={ () => history.back() }>取消</span>
