import { Popup, List } from 'antd-mobile'
import React from 'react'
import { Search, Mask, SlidePage, CitySearch, Evaluation, PicHandle } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'

import '../style/search.scss'
import icDelete from '../img/delete_tong.png'
import icNouse from '../img/nouse.png'

const Item = List.Item

const Searchcomponent = props => {
  const { lat, lng, city, level, theme, prov, sort,
    handleGoDetails, handleSearch,
    handleCityname, citydata, selectedCIty,
    handleSearchHistory, handleDeleteHistorry, keywordArr, width, height,
  } = props

  const fetchData = {
    prov, city, lat, lng, level, theme, sort,
  }
  return (
    <div className='searchWrap'>
      <Search
        inputPlaceholder={ '请输入景点名称／主题' }
        leftComponent={ <Citylocation citydata={ citydata } handleCityname={ handleCityname } selectedCIty={ selectedCIty } /> }
        rightComponent={ <CancelBtn /> }
        content={ <SearchHistory handleDeleteHistorry={ handleDeleteHistorry } keywordArr={ keywordArr } /> }
        listItem={ <ListItem handleGoDetails={ handleGoDetails } width={ width } height={ height } /> }
        onFeach={ (keyword, cb) => handleSearch(fetchData, keyword, cb, handleSearchHistory) }
        handleResult={ result => { handleGoDetails(result.id) } }
        noResult={ <NoOneComponent /> }
      />
    </div>
  )
}
export default Searchcomponent

// 当进入搜索页面的时候有个历史记录的展示
const SearchHistory = ({ handleDeleteHistorry, onKeywordChange, keywordArr = [] }) => {
  keywordArr = keywordArr.slice(0, 7)
  if (keywordArr && keywordArr.length > 0) {
    return (
      <div className='searchHistory'>
        <div className='searchHistoryMain searchoto'>
          <List>
            <Item className='title_oto'><span className='span_oto'>搜索记录</span></Item>
            {
              (keywordArr.map((item, index) => (
                <Item key={ `${ index + item }` } onClick={ () => { onKeywordChange(item) } }>{ item }</Item>
              )))
            }
            <Item className='deleteBtn' onClick={ () => { handleDeleteHistorry() } }><span><img alt='加载中' src={ icDelete } /></span><span>清除搜索记录</span></Item>
          </List>
        </div>
      </div>
    )
  }
  return (
    <div className='searchHistory'>
      <div className='searchHistoryMain searchoto'>
        <List>
          <Item className='title_oto'><span className='span_oto'>暂无搜索记录</span></Item>
        </List>
      </div>
    </div>
  )
}

// 地点定为
const Citylocation = ({ citydata, selectedCIty, handleCityname }) => {
// console.log('citydata---',citydata);
  return (
    <div className='citylocation' onClick={ () => {
      Popup.hide()
      Mask(
        <SlidePage target='left' showClose={ false }>
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
// 搜索上的取消按钮
const CancelBtn = () => {
  return (
    <div className='cancelBtn' onClick={ () => window.location.href = '/menpiao' }>取消</div>
  )
}

// 列表的展示 和主题的选择
// const SearchShowList = ({ props, fetchData }) => {
//   const {
//     handleGoDetails, handleFetchMore, offset,
//   } = props
//
//   if (fetchData.lat && fetchData.lng ) {
//     return (
//       <div className='searchListWrap'>
//         <Listview  className='ListMain'
//           offset={ offset } limit={ 10 } fetchData={ fetchData }
//           onFetch={ handleFetchMore } listItem={ <ListItem handleGoDetails={ handleGoDetails }/>}
//           noOneComponent={ <NoOneComponent /> }
//         />
//         <div className='clear' />
//       </div>
//     )
//   }
//   return (<div />)
// }

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
