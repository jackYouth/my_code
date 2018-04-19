import React from 'react'
import { Tabs, Icon } from 'antd-mobile'
import { Listview, SlidePage, Mask, CitySearch, UserCenter } from '@boluome/oto_saas_web_app_component'
import { getStore, parseLocName } from '@boluome/common-lib'
// import { vconsole } from 'vconsole'
import SelectTab from './selectTab'
import Cart from './cart'

import '../style/app.scss'
import noshop from '../img/noshop.png'

const TabPane = Tabs.TabPane

const App = app => {
  const { tip, handleTip, subcategoriesData, cartdata, categoriesData, callback, keys, handleSelectsub, areaId, limit, offset, categoryIdList, getCommodities, goOrder, delBuycart } = app
  if (categoriesData && categoriesData.length > 0) {
    return (
      <div className='app'>
        <UserCenter categoryCode='shengxian' orderTypes='shengxian' />
        { tip && <p className='tip' ref={ node => { if (node) { console.log('tip', tip, window.getComputedStyle(node).height) } } }><Icon onClick={ () => handleTip() } type={ require('svg/shengxian/cha.svg') } />因城市所售商品不同，请根据您的收货地址选择城市</p> }
        <Title app={ app } />
        <div className='tabs'>
          <Tabs defaultActiveKey={ keys } onChange={ key => { callback(key, categoriesData) } } pageSize={ 3 } animated={ false }>
            { categoriesData.map(o => (
              <TabPane tab={ `${ o.name }` } key={ o.areaId }>
                <div />
              </TabPane>
            )) }
          </Tabs>
        </div>
        { subcategoriesData && <SelectTab data={ subcategoriesData } categoryIdList={ categoryIdList } selectSub={ handleSelectsub } /> }
        <div className='productList' style={ tip ? { height: 'calc(100% - 4.21rem)' } : { height: 'calc(100% - 3.66rem)' } }>
          { subcategoriesData && <Listview
            noOneComponent={ <Noshop /> }
            listItem={ <Listviewli app={ app } /> }
            onFetch={ getCommodities }
            limit={ limit }
            offset={ offset }
            fetchData={{ channel: getStore('channel', 'session'), areaId, categoryIdList }}
          /> }
        </div>
        <Cart listItem={ <Listviewli cart={ 1 } app={ app } /> } cartdata={ cartdata } submit={ goOrder } delBuycart={ delBuycart } />
      </div>
    )
  } else if (categoriesData && categoriesData.length === 0) {
    return (
      <div className='app'>
        <UserCenter categoryCode='shengxian' orderTypes='shengxian' />
        <Title app={ app } />
        <div className='noServ'>
          <div className='empShop'>
            <div>
              <Icon type={ require('svg/shengxian/noshop.svg') } />
              <p>该城市尚未提供此服务<br />敬请期待</p>
            </div>
          </div>
        </div>
        <Cart listItem={ <Listviewli cart={ 1 } app={ app } /> } cartdata={ cartdata } submit={ goOrder } delBuycart={ delBuycart } />
      </div>
    )
  }
  return (<div className='cinemas' style={{ display: 'none' }}>加载中</div>)
}

const Listviewli = ({ data, app, cart }) => {
  const { areaId, goDetail, cartdata, setBuycart } = app
  return (
    <div className='listitem_shop' onClick={ () => goDetail(areaId, data) }>
      { data.isBuy === false && <div className='list_mask' onClick={ e => e.stopPropagation() } /> }
      <div className='pic' style={ cart ? { width: '0.8rem', height: '0.8rem' } : {} }><img alt='生鲜' style={ cart ? { width: '0.8rem', height: '0.8rem' } : {} } src={ data.commodityPicList[0].picUrl } /></div>

      <div className='info' style={ cart ? { width: 'calc(100% - 0.8rem)', padding: '0 0 0 0.28rem' } : {} }>
        <h1>{ data.commodityName }</h1>
        { !cart && <p>{ data.spec }</p> }
        <div className='bottomPart'>
          <p>¥{ data.price }</p>
          <div className='buyBtn'>
            <Buybtn cartdata={ cartdata } setBuycart={ setBuycart } data={ data } />
          </div>
        </div>
      </div>
    </div>
  )
}

const Buybtn = ({ cartdata, data, setBuycart }) => {
  let index = ''
  for (let i = 0; i < cartdata.length; i++) {
    if ((cartdata[i].commodityCode).split(',')[0] === (data.commodityCode).split(',')[0]) {
      index = i
      break
    }
  }
  const buyQuantity = (typeof index === 'number') ? cartdata[index].buyQuantity : ''
  return (
    <div className='buyBtn'>
      <Icon type={ (buyQuantity === 20) ? require('svg/shengxian/addh.svg') : require('svg/shengxian/add.svg') } onClick={ e => setBuycart(e, data, 'add') } />
      <span>{ buyQuantity }</span>
      { (typeof index === 'number') && <Icon type={ require('svg/shengxian/sub.svg') } onClick={ e => setBuycart(e, data, 'sub') } /> }
    </div>
  )
}

// noONe
const Noshop = () => {
  return (
    <div className='noServ'>
      <div className='empShop'>
        <img src={ noshop } alt='无商品' />
        <p>商品都卖完了<br />下次记得早点来噢~</p>
      </div>
    </div>
  )
}

// top组件
const Title = ({ app }) => {
  const { handleCity, cityName, cityArr, goSear } = app
  return (
    <div className='top'>
      <span className='locCity'
        onClick={ () => {
          return (Mask(
            <SlidePage target='right' showClose={ false } >
              <CitySearch localCity={ getStore('currentPosition', 'session') ? parseLocName(getStore('currentPosition', 'session').city) : cityName }
                categoryCode='shengxian'
                handleCityData={ res => { handleCity(res) } }
                api={ cityArr }
              />
            </SlidePage>,
            { mask: false }
          ))
        } }
      >
        { cityName }
        <Icon type={ require('svg/shengxian/arrowdown.svg') } />
      </span>
      <Icon
        className='search'
        type={ require('svg/shengxian/sousuo.svg') }
        onClick={ () => { goSear() } }
      />
    </div>
  )
}
export default App
