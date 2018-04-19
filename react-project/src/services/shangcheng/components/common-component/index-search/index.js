/*
  props:
    showCart: 是否显示右侧购物车
    cartNum:  当前购物车中商品总数量
    categoryLevel:  关键字搜索级别
    handleChangeProvince: 改变省份后的回调，传入则显示省份模块
    specialtyProvince:    省份数据
    fixed:    固定模式，并不会因为失焦而隐藏，并且取消是一直存在，无失焦之分
    defaultRightComponent: 非搜索状态下，默认的右侧组件，
*/

import React, { Component } from 'react'
import { getStore, setStore } from '@boluome/common-lib'
import { Empty, Loading } from '@boluome/oto_saas_web_app_component'
import { Toast, Icon } from 'antd-mobile'
import { get } from '../../../actions/ajax'

import DefaultBottom from './/default-bottom'
import SearchResultBottom from './/search-result-bottom'

import '../../../styles/comment-component/index-search.scss'

export default class IndexSearch extends Component {
  constructor(props) {
    super(props)
    const { cartNum = 0, categoryLevel = 0 } = this.props
    const searchHistorys = getStore(`search_sc_${ categoryLevel }`) ? getStore(`search_sc_${ categoryLevel }`) : []
    this.state = {
      searchValue:    '',
      searchStatus:   false,
      changeCartNum:  false,
      showProvince:   false,
      currentProvice: { name: '全国', id: 0 },
      cartNum,
      searchHistorys,
    }
    this.handleHistoryClick = this.handleHistoryClick.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSearchStatus = this.handleSearchStatus.bind(this)
    this.handleChangeProvinceMid = this.handleChangeProvinceMid.bind(this)
    this.handleProviceContainerClick = this.handleProviceContainerClick.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    const { cartNum } = nextProps
    const preCartNum = this.state.cartNum
    if (cartNum !== preCartNum) {
      this.setState({ cartNum, changeCartNum: true })
      setTimeout(() => {
        this.setState({ changeCartNum: false })
      }, 100)
    }
  }
  inputChange(searchValue) {
    searchValue = searchValue.target.value
    this.setState({ searchValue })

    // 当500s内第二次触发了input的onchange事件，则取消上一个搜索的定时器，重新设定一个
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.handleSearch(searchValue), 500)
  }
  handleSearch(param) {
    // 如果搜索关键字为空，则取消搜索结果
    if (param === '') {
      this.setState({ searchResult: '' })
      return
    }
    const closeLoading = Loading()
    const selectedCity = getStore('selectedCity', 'session')
    const { categoryLevel = 0, brandId } = this.props
    let { searchHistorys } = this.state
    const paras = {
      param,
      limit:  1,
      offset: 20,
      categoryLevel,
      ...selectedCity,
    }
    if (categoryLevel === -1) paras.brandId = brandId
    paras.mapType = 'gaode'
    get('/mall/v1/resources', paras).then(({ code, data, message }) => {
      if (code === 0) {
        this.setState({ searchResult: data })
        searchHistorys = searchHistorys.filter(i => i !== param)
        searchHistorys.unshift(param)
        setStore(`search_sc_${ categoryLevel }`, searchHistorys)
        this.setState({ searchHistorys })
      } else {
        Toast.fail(message)
      }
      closeLoading()
    })
  }
  handleHistoryClick(searchValue) {
    this.handleSearch(searchValue)
    this.setState({ searchValue })
  }
  handleSearchStatus(searchStatus) {
    this.setState({ searchStatus })
  }
  handleProviceContainerClick(showProvince) {
    this.setState({ showProvince })
  }
  handleChangeProvinceMid(currentProvice) {
    const { handleChangeProvince } = this.props
    handleChangeProvince(currentProvice.id)
    this.setState({ currentProvice, showProvince: false })
  }
  handleBlur(searchValue) {
    // 如果搜索关键字为空，则取消搜索结果
    if (searchValue === '') this.setState({ searchResult: '' })
  }
  handleCancelClick() {
    const { handleContainerClose } = this.props
    this.setState({ searchValue: '', searchResult: '' })
    if (handleContainerClose) handleContainerClose()
  }

  render() {
    // searchResult: 是否是搜索状态
    const { searchValue, searchStatus, searchResult, cartNum, changeCartNum, currentProvice, showProvince, searchHistorys } = this.state
    const { handleChangeMenu, specialtyProvince, handleChangeProvince, defaultRightComponent, categoryLevel = 0, placeholder = '请输入搜索内容' } = this.props
    let { showCart, fixed } = this.props
    showCart = Boolean(showCart)
    fixed = Boolean(fixed)
    return (
      <div className='index-search'>
        <div className='index-search-header'>
          {
            handleChangeProvince && !searchStatus &&
            <div className='select-provice' onClick={ () => this.handleProviceContainerClick(!showProvince) }>
              <span>{ currentProvice.name }</span>
              <Icon type='down' size='xs' />
            </div>
          }
          <div className='search-main'>
            <input
              onFocus={ () => this.handleSearchStatus(true) }
              onBlur={ () => this.handleBlur(searchValue) }
              value={ searchValue }
              placeholder={ placeholder }
              onChange={ value => this.inputChange(value) }
              type='text'
              ref={ node => this.sIpt = node }
            />
          </div>
          {
            showCart && !searchStatus &&
            <div className={ changeCartNum ? 'cart-container enlarge' : 'cart-container' } onClick={ handleChangeMenu ? () => handleChangeMenu('cart') : '' }>
              <Icon type={ require('svg/shangcheng/cart.svg') } size='md' />
              {
                Boolean(cartNum) &&
                <span className='sc-badge-icon'>{ cartNum > 99 ? '99+' : cartNum }</span>
              }
            </div>
          }
          {
            (searchStatus || fixed) &&
            <Cancel handleSearchStatus={ this.handleSearchStatus } handleCancelClick={ () => this.handleCancelClick() } />
          }
          {
            !searchStatus && defaultRightComponent &&
            <div className='default-right-component'>{ React.cloneElement(defaultRightComponent, { ...this.props }) }</div>
          }
        </div>
        <div className='index-search-bottom' style={{ opacity: (searchStatus || fixed) ? '1' : '0', zIndex: (searchStatus || fixed) ? '3' : '-1' }}>
          {
            !searchResult &&
            <DefaultBottom { ...{ handleHistoryClick: this.handleHistoryClick, searchHistorys, categoryLevel } } />
          }
          {
            searchResult && (!searchResult.brands || (searchResult.brands.length === 0 && searchResult.commoditys.length === 0)) &&
            <Empty message='无相关结果' imgUrl={ require('../../../img/no_commodity.png') } style={{ background: '#f5f5f6', height: 'calc(100% - 1rem)' }} />
          }
          {
            searchResult && searchResult.brands && (searchResult.brands.length !== 0 || searchResult.commoditys.length !== 0) &&
            <SearchResultBottom { ...{ searchResult } } />
          }
        </div>
        {
          showProvince && !searchResult &&
          <ProvinceList { ...{ currentProvice, specialtyProvince, handleChangeProvince: this.handleChangeProvinceMid, handleCloseProvice: this.handleProviceContainerClick } } />
        }
      </div>
    )
  }
}

const Cancel = ({ handleSearchStatus, handleCancelClick }) => (<span onClick={ () => { handleCancelClick(); handleSearchStatus(false) } } style={{ fontSize: '0.28rem', color: '#ffab00', display: 'inline-block', paddingLeft: '.3rem' }}>取消</span>)

const ProvinceList = ({ currentProvice, specialtyProvince, handleChangeProvince, handleCloseProvice }) => {
  return (
    <div className='provice-popup' onTouchMove={ e => e.preventDefault() } onClick={ () => handleCloseProvice(false) }>
      <p className='provice-title' onClick={ e => e.stopPropagation() }>特产地区</p>
      <ul className='provice-list' onClick={ e => e.stopPropagation() }>
        {
          specialtyProvince.map(o => (
            <li key={ o.id } className={ o.name === currentProvice.name ? 'provice-item active' : 'provice-item' }>
              <p className='line-1' onClick={ () => handleChangeProvince(o) }>{ o.name }</p>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
