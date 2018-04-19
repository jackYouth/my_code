import React from 'react'
import { Icon, Toast, List, Switch, Modal } from 'antd-mobile'
import { login } from 'business'
import { getStore, parseLocName, setStore } from '@boluome/common-lib'
import { Mask, SlidePage, Longlistview, Empty, UserCenter, CitySearch, Nolocation } from '@boluome/oto_saas_web_app_component'
import { forceCheck } from 'react-lazyload'
import { browserHistory } from 'react-router'
// import VConsole from 'vconsole'
import AddressSearchGaode from './NewAddressSearch'
import ListItem from './listItem'
import '../style/index.scss'
import img from '../img/notfound.png'
import noBusiness from '../img/nobusinessmen.png'
import banner from '../img/banner2.png'
import fangda from '../img/fangda.png'
import imgwd from '../img/arrowDW.png'
import totop from '../img/totop.png'

class LeftComponent extends React.Component {
  static defaultProps = {
    localCity: getStore('localCity', 'session'),
  }
  constructor(props) {
    super(props)
    const { selectedAddress } = props
    const localCity = getStore('localCity', 'session')
    this.state = {
      currentCity: (selectedAddress && selectedAddress.cityName) ? selectedAddress.cityName : localCity,
    }
    this.handleCityData = this.handleCityData.bind(this)
  }
  handleCityData(res) {
    const { handleChangeCurrentCity } = this.props
    this.setState({
      currentCity: res.name,
    })
    handleChangeCurrentCity(res)
  }
  render() {
    const { currentCity } = this.state
    const localCity = this.props.localCity || getStore('localCity', 'session')

    const pStyle = {
      lineHeight:   '.52rem',
      height:       '.52rem',
      fontSize:     '.28rem',
      color:        '#888',
      width:        '100%',
      background:   '#fff',
      paddingLeft:  '.05rem',
      paddingRight: '.05rem',
      textAlign:    'center',
      overflow:     'hidden',
      borderRadius: '.08rem',
      position:     'relative',
    }
    const spanStyle = {
      width:        '1rem',
      textOverflow: 'ellipsis',
      overflow:     'hidden',
      whiteSpace:   'nowrap',
      display:      'inline-block',
      float:        'left',
    }
    const svgStyle = {
      position:        'absolute',
      top:             '50%',
      transform:       'translateY(-50%)',
      WebkitTransform: 'translateY(-50%)',
      right:           '3px',
    }

    return (
      <p style={ pStyle } onClick={ () =>
        Mask(
          <SlidePage target='right' showClose={ false } >
            <CitySearch localCity={ !localCity ? '上海市' : localCity } categoryCode='waimai' showCancel='true' handleCityData={ this.handleCityData } api={ '/basis/v1/waimai/ele/cities' } />
          </SlidePage>
          , { mask: false })
        }
      >
        <span style={ spanStyle }>{ currentCity }</span>
        <Icon style={ svgStyle } type='down' size='xs' />
      </p>
    )
  }
}

// 首页
const App = props => {
  // console.log('APPprops-------', props)
  const currentAddress = getStore('currentAddress', 'session')
  const { isFromRestDetail, handleScrollTop, handleFetchMore, fetchData = {}, restList = [], chooseContact = {},
          handleAddress, addressResult, offset, locationErr = false, categories = [], handleGoTop, componentDidUpdateFun,
        } = props
  const { latitude, longitude } = fetchData
  let showAddress
  if (addressResult && addressResult.address) {
    // console.log('111', addressResult)
    showAddress = addressResult.address
  } else if (chooseContact && chooseContact.address) {
    showAddress = chooseContact.address
  } else if (currentAddress) {
    // console.log('222', currentAddress)
    showAddress = currentAddress
  } else {
    // console.log('333')
    showAddress = '定位中...'
  }
  // console.log('offset in indexPage------>', offset, restList.length)
  // const vconsole = new VConsole()
  return (
    <div>
      {
        latitude && longitude && categories.length === 8 ?
          (<Longlistview
            limit={ 10 }
            offset={ offset }
            fetchData={ fetchData }
            onFetch={ handleFetchMore }
            listItem={ <ListItem data={ props } handleScrollTop={ handleScrollTop } /> }
            topComponent={ <TopComponent datas={ props } showAddressP={ showAddress } /> }
            onScroll={ forceCheck }
            noOneComponent={ <Empty message='附近没有外卖商家，努力覆盖中' imgUrl={ noBusiness } /> }
            dataList={ isFromRestDetail ? restList : [] }
            componentDidUpdateFun={ () => { componentDidUpdateFun(props) } }
          />)
        :
          locationErr ?
            <Nolocation handleBtnEvevtL={ () => {
              Mask(
                <SlidePage target='right' showClose={ false }>
                  <AddressSearchGaode
                    selectedAddress={{ ...{ latitude: 31.24916171, longitude: 121.48789949 }, cityName: '上海' }}
                    onSuccess={ (v, i) => handleAddress(v, i) }
                    LeftComponent={ LeftComponent }
                  />
                </SlidePage>
              , { mask: false })
            } }
              handleBtnEvevtR={ () => {
                setTimeout(() => {
                  Toast.info('定位获取失败，请手动选择收货地址', 2)
                }, 1000)
              } }
              locationText='定位失败，请确认定位授权与位置信息是否开启'
            />
          : ''
      }
      <UserCenter categoryCode='waimai' myClick={ cb => { login(err => { if (err) { console.log(err) } else { cb() } }, true) } } />
      <div className='goTop' onClick={ () => handleGoTop() }>
        <img src={ totop } alt='goTop' />
      </div>
    </div>
  )
}

export default App

const TopComponent = ({ datas, showAddressP }) => {
  const { choosePoint = {}, handleAddress, categories = [], goFilter, addressResult = {}, showBanner = false,
    handleRecommend, orderBy = '', bInvoice = 0, handleIsInvoiceChange, bVipDelivery = 0, handleIsVipDelivery,
    handleCheckdInvoice, handleShowRecommend, isShowRecommend = false,
  } = datas
  // console.log('bInvoice', bInvoice)
  const showAddress = showAddressP
  const geopoint = choosePoint && choosePoint.latitude ? choosePoint : getStore('geopoint', 'session')
  // 搜索列表获取数据方法
  const loCity = getStore('currentPosition', 'session') ? parseLocName(getStore('currentPosition', 'session').city) : ''
  // console.log('categories in topComponent', categories)
  if (loCity) {
    setStore('localCity', loCity, 'session')
  } else {
    setStore('localCity', '上海', 'session')
  }

  return (
    <div className='appContainer'>
      <div className='topBar'>
        <span className='addressBox' onClick={ () => {
          if (!getStore('customerUserId', 'session')) {
            login(err => {
              if (err) {
                console.log(err)
              } else {
                Mask(
                  <SlidePage target='right' showClose={ false }>
                    <AddressSearchGaode
                      { ...geopoint }
                      selectedAddress={{ ...geopoint, cityName: getStore('localCity', 'session') }}
                      onSuccess={ (v, i) => handleAddress(v, i) }
                      chooseContact={ addressResult }
                      LeftComponent={ LeftComponent }
                    />
                  </SlidePage>
                , { mask: false })
              }
            }, true)
          } else {
            Mask(
              <SlidePage target='right' showClose={ false }>
                <AddressSearchGaode
                  { ...geopoint }
                  selectedAddress={{ ...geopoint, cityName: getStore('localCity', 'session') }}
                  onSuccess={ (v, i) => handleAddress(v, i) }
                  chooseContact={ addressResult }
                  LeftComponent={ LeftComponent }
                />
              </SlidePage>
            , { mask: false })
          }
        } }
        >
          { showAddress }
        </span>
        <img src={ imgwd } style={{ margin: '0 0 .1rem .1rem', width: '.25rem' }} alt='img' />
        <div className='searchBar' style={{ backgroundColor: 'transparent', lineHeight: '.7rem', textAlign: 'center', marginTop: '.3rem', height: 'auto' }}>
          <div className='searchBar-box' style={{ backgroundColor: '#fff', width: '100%', borderRadius: '1rem' }} onClick={ () => browserHistory.push('/waimai/search') }>
            <img src={ fangda } alt='fangda' style={{ width: '.2rem', marginRight: '.2rem' }} />
            <span style={{ fontSize: '.26rem', height: '.7rem', color: '#999' }}>搜索商家、商品名称</span>
          </div>
        </div>
      </div>
      <div className='category'>
        <ul>
          {
            categories.map(({ icon, categoryName, categoryId }) => {
              return (
                <li key={ `categoryKey${ categoryId }` } onClick={ () => goFilter(categoryId) }>
                  <img src={ icon } alt={ categoryName } />
                  <span>{ categoryName }</span>
                </li>
              )
            })
          }
        </ul>
      </div>
      {
        showBanner ?
          <div className='banner_container'>
            <img src={ banner } alt='banner' style={{ width: '100%', height: '2.2rem', marginTop: '.12rem' }} />
          </div>
        : ''
      }
      <div className='recommendStore'>
        <div className='recommendTitle'>
          <span className='hish' />
          <span>推荐商家</span>
          <span className='hish' />
        </div>
        <div className='recommend-filter'>
          <span onClick={ () => handleRecommend(4) } style={{ fontWeight: orderBy === 4 ? 'bold' : 'normal' }}>销量最高</span>
          <span className='hish2' />
          <span onClick={ () => handleRecommend(2) } style={{ fontWeight: orderBy === 2 ? 'bold' : 'normal' }}>好评优先</span>
          <span className='hish2' />
          <span onClick={ () => handleRecommend(6) } style={{ fontWeight: orderBy === 6 ? 'bold' : 'normal' }}>距离最近</span>
          <span className='hish2' />
          <span onClick={ () => { handleShowRecommend(1) } } style={{ fontWeight: bInvoice || bVipDelivery ? 'bold' : 'normal' }} >筛选<img src={ require('../img/grayArrowDown.png') } alt='' style={{ verticalAlign: 'middle', width: '.14rem', marginLeft: '.1rem' }} /></span>
        </div>

        <Modal
          popup
          transparent
          visible={ isShowRecommend }
          onClose={ () => handleShowRecommend() }
          animationType='slide-up'
          className='operate-filter-container'
        >
          <div className='operate-filter'>
            <List>
              <List.Item extra={ <Switch checked={ bInvoice } onChange={ checked => { handleIsInvoiceChange(checked) } } /> }>
                <span className='tagG'>票</span><span>开发票</span>
              </List.Item>
              <List.Item extra={ <Switch checked={ bVipDelivery } onChange={ checked => { handleIsVipDelivery(checked) } } /> }>
                <span className='tagG'>送</span><span>蜂鸟专送</span>
              </List.Item>
            </List>
            <div className='btnBox'>
              <button onClick={ () => handleCheckdInvoice(bInvoice, bVipDelivery) }>确定</button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  )
}

// 搜索组件右侧取消组件
// const Cancel = props => {
//   const { handleContainerClose } = props
//   return (
//     <span className='cancel' onClick={ () => handleContainerClose() }>取消</span>
//   )
// }
