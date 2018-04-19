import React from 'react'
import { List, Switch, Modal } from 'antd-mobile'
import { Longlistview, Empty } from '@boluome/oto_saas_web_app_component'
import { forceCheck } from 'react-lazyload'
import { browserHistory } from 'react-router'
import ListItem from './listItem'
import grayArrDown from '../img/grayArrowDown.png'
import '../style/index.scss'
import '../style/filter.scss'
import img from '../img/notfound.png'
import fangda from '../img/fangda.png'

// 商家删选页
let lastBinvo
let lastVip
const Filter = props => {
  // console.log('Filter props-------', props)
  const { handleScrollTop, categoryId, handleFetchMore, offset, orderByChoose, trueInvoice, trueVipDelivery,
          isFromRestDetail, fetchData, restList = [],
        } = props
  fetchData.categoryId = categoryId
  fetchData.orderBy = props.orderByChoose ? orderByChoose : ''
  if (trueInvoice) {
    fetchData.invoice = trueInvoice
  }
  if (trueVipDelivery) {
    fetchData.isVipDelivery = trueVipDelivery
  }
  // console.log('offset in filter------>', offset, restList.length, categoryId)

  return (
    <div className='filterContainer'>
      {
        orderByChoose && categoryId ?
          <Longlistview
            limit={ 10 }
            offset={ offset }
            onFetch={ handleFetchMore }
            fetchData={ fetchData }
            listItem={ <ListItem data={ props } handleScrollTop={ handleScrollTop } /> }
            topComponent={ <TopComponent data={ props } /> }
            onScroll={ forceCheck }
            noOneComponent={ <Empty message='没有相关结果，换个筛选条件试试～' imgUrl={ img } /> }
            dataList={ isFromRestDetail ? restList : [] }
          />
        : ''
      }
    </div>
  )
}

export default Filter

const TopComponent = ({ data }) => {
  const { categoryId, categories = [], handleShowFilter, orderByChoose, showFilter, bInvoice = 0, bVipDelivery = 0 } = data
  const orderBy = [{ id: 1, name: '默认排序' },
                   { id: 2, name: '好评优先' },
                   { id: 3, name: '起送价最低' },
                   { id: 4, name: '销量最高' },
                   { id: 5, name: '配送最快' },
                   { id: 6, name: '距离最近' }]
  let showCategories = ''
  let showOrderBy = ''
  categories.forEach(o => {
    if (o.categoryId === categoryId) {
      showCategories = o.categoryName
    }
  })
  orderBy.forEach(o => {
    if (o.id === orderByChoose) {
      showOrderBy = o.name
    }
  })

  return (
    <div className='top-container'>
      <div className='searchBar' style={{ backgroundColor: '#3d97ff', lineHeight: '.7rem', textAlign: 'center', padding: '.3rem', height: 'auto' }}>
        <div className='searchBar-box' style={{ backgroundColor: '#fff', width: '100%', borderRadius: '1rem' }} onClick={ () => browserHistory.push('/waimai/search') }>
          <img src={ fangda } alt='fangda' style={{ width: '.2rem', marginRight: '.2rem' }} />
          <span style={{ fontSize: '.26rem', height: '.7rem', color: '#999' }}>搜索商家、商品名称</span>
        </div>
      </div>
      <div className='filterBar'>
        <div className='categories chooseTab' onClick={ () => {
          if (showFilter === 1) {
            handleShowFilter(0)
          } else {
            handleShowFilter(1)
          }
        } }
        >
          <span>{ showCategories }</span>
          <img src={ grayArrDown } alt='arrdown' />
        </div>
        <div className='chooseTab' onClick={ () => {
          if (showFilter === 2) {
            handleShowFilter(0)
          } else {
            handleShowFilter(2)
          }
        } }
        >
          <span>{ showOrderBy }</span>
          <img src={ grayArrDown } alt='arrdown' />
        </div>
        <div className='chooseTab' onClick={ () => {
          if (showFilter === 3) {
            handleShowFilter(0)
          } else {
            handleShowFilter(3)
          }
          lastBinvo = bInvoice
          lastVip = bVipDelivery
        } }
        >
          <span style={{ fontWeight: bInvoice || bVipDelivery ? 'bold' : 'normal' }} >筛选</span>
          <img src={ grayArrDown } alt='arrdown' />
        </div>
        <div className='filter-layer' style={{ display: showFilter ? 'block' : 'none' }}>
          <FilterLayerChildren data={ data } orderByP={ orderBy } />
        </div>
      </div>
    </div>
  )
}

const FilterLayerChildren = ({ data, orderByP }) => {
  const { bVipDelivery, showFilter, handleShowFilter, handleIsInvoiceChange, handleCheckdInvoice, handleIsVipDelivery,
          bInvoice, orderByChoose, handleCategoryChange, handleOrderbyChange, categories = [],
        } = data
  const orderBy = orderByP
  let showLayer

  const CategoryFilter = (
    <div className='category-filter'>
      {
        categories.map(({ categoryName, categoryId }) => (
          <div key={ `categortList-key${ categoryId }` } className={ data.categoryId === categoryId ? 'filterItem choose' : 'filterItem' }
            onClick={ () => handleCategoryChange(categoryId) }
          >
            { categoryName }
          </div>
        ))
      }
    </div>
  )

  const OrderByFilter = (
    <div className='orderby-filter'>
      {
        orderBy.map(({ id, name }) => (
          <div key={ `orderByKey${ id }` } className={ orderByChoose === id ? 'filterItem choose' : 'filterItem' }
            onClick={ () => handleOrderbyChange(id) }
          >
            { name }
          </div>
        ))
      }
    </div>
  )

  const OperateFilter = (
    <div className='operate-filter'>
      <List>
        <List.Item extra={ <Switch checked={ bInvoice } onChange={ checked => { handleIsInvoiceChange(checked); handleShowFilter(3) } } /> }>
          <span className='tagG'>票</span><span>开发票</span>
        </List.Item>
        <List.Item extra={ <Switch checked={ bVipDelivery } onChange={ checked => { handleIsVipDelivery(checked); handleShowFilter(3) } } /> }>
          <span className='tagG'>送</span><span>蜂鸟专送</span>
        </List.Item>
      </List>
      <div className='btnBox'>
        <button onClick={ () => handleCheckdInvoice(bInvoice, bVipDelivery) }>确定</button>
      </div>
    </div>
  )

  if (showFilter) {
    switch (showFilter) {
      case 1:
        showLayer = CategoryFilter
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'
        break
      case 2:
        showLayer = OrderByFilter
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'
        break
      case 3:
        showLayer = OperateFilter
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'
        break
      default:
        showLayer = ''
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
    }
  }

  return (
    <div className='FilterLayerChildren' style={{ display: showFilter ? 'block' : 'none' }}>
      <Modal
        popup
        transparent
        visible={ showFilter }
        onClose={ () => handleShowFilter(0, lastBinvo, lastVip, 1) }
        animationType='slide-up'
        className='showLayer'
      >
        { showLayer }
      </Modal>
    </div>
  )
}

// <div className='showLayer'>{ showLayer }</div>
// <div className='filter-mask' onClick={ () => { handleShowFilter(0, lastBinvo, lastVip, 1) } } />
