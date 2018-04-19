import React from 'react'
import { Icon, WhiteSpace } from 'antd-mobile'
import { Listview, Search, Mask, SlidePage, CitySearch, Evaluation, PicHandle, UserCenter } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'

import SelectTab from './selectTab'
import '../style/index.scss'
import icNouse from '../img/nouse.png'

const App = props => {
  const { lat, lng, city, level, theme, prov, sort,
    handleGoDetails, handleSearch,
    handleCityname, citydata, selectedCIty, handleSearchOnclick, // goOrderDetails,
    myClick,
  } = props

  const fetchData = {
    lat, lng, prov, city, level, theme, sort,
  }
  // const width = document.body.clientWidth
  return (
    <div className='indexWrap'>
      <UserCenter categoryCode='menpiao' myClick={ myClick } />
      <Search
        inputPlaceholder={ '请输入景点名称／主题' }
        leftComponent={ <Citylocation citydata={ citydata } handleCityname={ handleCityname } selectedCIty={ selectedCIty } /> }
        content={ <IndexShowList props={ props } fetchData={ fetchData } /> }
        listItem={ <ListItem handleGoDetails={ handleGoDetails } /> }
        onFeach={ (keyword, cb) => handleSearch(fetchData, keyword, cb) }
        handleResult={ result => { handleGoDetails(result.id) } }
        noResult={ <NoOneComponent /> }
        handleClick={ () => handleSearchOnclick() }
      />
    </div>
  )
}

export default App

// 地点定为
const Citylocation = ({ citydata, selectedCIty, handleCityname }) => {
  // console.log('citydata---',citydata);
  return (
    <div className='citylocation' onClick={ () => {
      Mask.closeAll()
      Mask(
        <SlidePage target='left' showClose={ false } >
          <CitySearch localCity='上海' categoryCode='menpiao' api={ citydata } handleCityData={ result => handleCityname(result) } />
        </SlidePage>
        , { mask: false, style: { position: 'absolute' } }
      )
    } }
    >
      <span className='cityNameshow'>{ selectedCIty }</span>
      <span>{ selectedCIty ? <img alt='加载中' className='jiaoPic' src={ require('../img/jiao.png') } /> : '' }</span>
    </div>
  )
}

// 列表的展示 和主题的选择
const IndexShowList = ({ props, fetchData }) => {
  const { // themeDatas,
    handleGoDetails, handleFetchMore,
    offset, width, height, filtering, themeDatas,
  } = props
  console.log('test-props---', props, 'filtering', filtering)
  if (fetchData.lat && fetchData.lng) {
    return (
      <div className='indexListWrap'>
        { themeDatas ? (<Seltab app={ props } />) : ('') }
        <WhiteSpace />
        <div className='tabs' ref={ node => { if (node) { node.style.height = window.getComputedStyle(node).height } } }>
          { filtering && <SelectTab { ...props } /> }
          <Listview className='ListMain'
            offset={ offset } limit={ 10 } fetchData={ fetchData }
            onFetch={ handleFetchMore } listItem={ <ListItem handleGoDetails={ handleGoDetails } width={ width } height={ height } /> }
            noOneComponent={ <NoOneComponent /> }
          />
          <div className='clear' />
        </div>
      </div>
    )
  }
  return (<div />)
}

const Seltab = ({ app }) => {
  const { themeDatas, filtered, filtering, handlePush } = app
  const categoryCodearr = themeDatas.categoryCode.filter(o => o.code === filtered.categoryCode)
  const sortarr = themeDatas.sort.filter(o => o.code === filtered.sort)
  const timeRangearr = themeDatas.timeRange.filter(o => o.code === filtered.timeRange)
  return (
    <div className='themeWrap'>
      <span style={ categoryCodearr[0].code ? { color: '#ffab00' } : {} } onClick={ () => handlePush(filtering, 'categoryCode') }>
        { categoryCodearr[0].text }
        <Icon style={ filtering === 'categoryCode' ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' } } type={ categoryCodearr[0].code ? require('../img/arrowdowning.svg') : require('../img/arrowdown.svg') } />
      </span>
      <span style={ sortarr[0].code ? { color: '#ffab00' } : {} } onClick={ () => handlePush(filtering, 'sort') }>
        { sortarr[0].text }
        <Icon style={ filtering === 'sort' ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' } } type={ sortarr[0].code ? require('../img/arrowdowning.svg') : require('../img/arrowdown.svg') } />
      </span>
      <span style={ timeRangearr[0].code ? { color: '#ffab00' } : {} } onClick={ () => handlePush(filtering, 'timeRange') }>
        { timeRangearr[0].text }
        <Icon style={ filtering === 'timeRange' ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' } } type={ timeRangearr[0].code ? require('../img/arrowdowning.svg') : require('../img/arrowdown.svg') } />
      </span>
    </div>
  )
}

// 列表的展示
const ListItem = ({ data, handleGoDetails, width, height }) => {
  const { image, name, level, city, marketPrice, openTime, price, id, disName } = data
  let stararr = []
  let levelstr = 3
  if (level === 'AAAAA') {
    stararr = '92%'; levelstr = 5
  } else if (level === 'AAAA') {
    stararr = '82%'; levelstr = 4
  } else if (level === 'AAA') {
    stararr = '72%'; levelstr = 3
  } else if (level === 'AA') {
    stararr = '56%'; levelstr = 2
  } else if (level === 'A') {
    stararr = '30%'; levelstr = 1
  } else {
    stararr = '65%'; levelstr = 3
  }
  const bodyfontSize = document.documentElement.style.fontSize
  const viewportScale = window.viewportScale
  if (bodyfontSize === '50px' && viewportScale === 1) {
    if (width && height) {
      width = 92
      height = 105
      // console.log('wwwww---------obj1.clientWidth=', width, height)
    }
  }
  return (
    <div>
      <li className='listItem' onClick={ () => { setStore('itemId', id, 'session'); handleGoDetails(id) } }>
        <div className='itemPic'><PicHandle picSrc={ image } sw={ width } sh={ height } /></div>
        <div className='itemMain'>
          <div className='itemTitle oto'><span className='otoS1'>{ name }</span><span className={ price === -1 ? 'otoS2 otoS4' : 'otoS2' }>{ price === -1 ? '已售完' : `￥${ price }` }<i>起</i></span></div>
          <div className='itemTime oto'><span className='otoS1'>开放时间：{ openTime }</span><span className='otoS2'>￥{ marketPrice }</span></div>
          <div className='itemStar oto'>
            <span className='otoS1'>
              <Evaluation defaultValue={ stararr } width={ '1.36rem' } />
            </span>
            <span className='otoS2'>{ disName }</span>
          </div>
          <div className='itemAddr oto'><span className='otoS1'>{ city }</span><span className='otoS2 otoS3'>{ levelstr }A景区</span></div>
        </div>
        <div className='clear' />
      </li>
    </div>
  )
}
// 当没有对应景点是的展示
const NoOneComponent = () => {
  return (
    <div className='noOneComponent'>
      <div className='noOneMain'>
        <img alt='加载中' src={ icNouse } />
        <div>哎呀，没有找到您想要的景区搜搜其他景区吧</div>
      </div>
    </div>
  )
}
