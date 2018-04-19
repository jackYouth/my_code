import React from 'react'
import { Icon, Tabs } from 'antd-mobile'
import { Mask, SlidePage, CitySearch } from '@boluome/oto_saas_web_app_component'
import { getStore, setStore, parseLocName } from '@boluome/common-lib'

import '../style/cinema.scss'

const TabPane = Tabs.TabPane

const Cinema = cinema => {
  const { regionLoading, keys, location, cityId, regionWrap, regionCon, cinemasData, defindcinemasData, callback, goSelect, handleRegion, getLct } = cinema
  if (cinemasData && cinemasData.length > 0) {
    const makeTabPane = o => {
      const cinemaList = d => { return o.cinemas.map(v => <CinemaItem key={ `cinema${ d }${ v.id }` } cinema={ v } keys={ keys } goSelect={ goSelect } />) }
      return (
        (
          <TabPane tab={ `${ o.date }` } key={ o.date }>
            <div className='overWrap' style={{ paddingBottom: '0.8rem', boxSizing: 'border-box' }}>
              { cinemaList(o.date) }
              {
                o.cinemas.length === 0 && <div className='noCinemas'>
                  <div className='noCinemasdiv'>
                    <Icon type={ require('svg/dianying/NO.svg') } />
                    <p>该地区当天暂无此影片排期哦~</p>
                  </div>
                </div>
              }
            </div>
          </TabPane>
        )
      )
    }
    const result = cinemasData && cinemasData.map(o => makeTabPane(o))
    return (
      <div className='cinemas'>
        <SearchTitle cinema={ cinema } />
        <div className='tabs' style={{ height: 'calc(100% - 0.8rem)' }}>
          { regionWrap && <SlidePage target='rigght' showClose={ false } showHash={ false }><Region cinema={ cinema } /></SlidePage> }
          { regionCon && <div className='clearRegion'><Icon type={ require('svg/dianying/shaixuaned.svg') } />当前选择区域：{ regionCon.name }<p><span onClick={ () => { handleRegion('', defindcinemasData) } }>清除地址</span></p></div> }
          {
            regionLoading && <Tabs defaultActiveKey={ keys } onChange={ res => callback(res) } pageSize={ 3 } animated={ false } style={{ height: '100%', backgroundColor: '#fff' }} >
              { result }
            </Tabs>
          }
          <Location location={ location } getLct={ getLct } regionCon={ regionCon } cityId={ cityId } />
        </div>
      </div>
    )
  } else if (cinemasData && cinemasData.length === 0) {
    return (
      <div className='cinemas'>
        <SearchTitle cinema={ cinema } />
        <div className='tabs' style={{ height: 'calc(100% - 0.8rem)' }}>
          { regionWrap && <SlidePage target='rigght' showClose={ false } showHash={ false }><Region cinema={ cinema } /></SlidePage> }
          { regionCon && <div className='clearRegion'><Icon type={ require('svg/dianying/shaixuaned.svg') } />当前选择区域：{ regionCon.name }<p><span onClick={ () => { handleRegion('', defindcinemasData) } }>清除地址</span></p></div> }
          <div className='noCinemas'>
            <div className='noCinemasdiv'>
              <Icon type={ require('svg/dianying/NO.svg') } />
              <p>此影片还没有上映影院哦，请再等等吧~</p>
            </div>
          </div>
          <Location location={ location } getLct={ getLct } regionCon={ regionCon } cityId={ cityId } />
        </div>
      </div>
    )
  }
  return (<div className='cinemas' style={{ display: 'none' }}>加载中</div>)
}


// 顶部搜索组件
const SearchTitle = ({ cinema }) => {
  const { channel, cityHot, cityArr, cityName, regionCon, regionWrap, handleFilter, handleCity, goSearchcin } = cinema
  return (
    <div className='searchTitle'>
      <span onClick={
        () => {
          handleFilter(true)
          return (Mask(
            <SlidePage target='right' showClose={ false } >
              <CitySearch
                localCity={ getStore('currentPosition', 'session') ? parseLocName(getStore('currentPosition', 'session').city) : cityName }
                categoryCode='dianying'
                handleCityData={ result => { handleCity(result) } }
                api={ cityArr }
                cityHot={ channel === 'maoyan' ? cityHot : [] }
              />
            </SlidePage>, { mask: false, style: { position: 'fixed' } })
          )
        }
      }
      >
        <i>{ cityName }</i>
        <Icon type={ require('svg/dianying/arrowdown.svg') } />
      </span>
      <div className='search' onClick={ () => { handleFilter(true); goSearchcin() } }>
        <Icon type={ require('svg/dianying/sousuo.svg') } />
        <span className='input'>查找影院名称</span>
      </div>
      <p onClick={ () => { handleFilter(regionWrap) } }><Icon type={ regionCon ? require('svg/dianying/shaixuaned.svg') : require('svg/dianying/shaixuan.svg') } /></p>
    </div>
  )
}


// 筛选列表组件
const Region = ({ cinema }) => {
  const { defindcinemasData, regionCon, regionData, handleRegion, regionWrap, handleFilter } = cinema
  const districtList = regionData && regionData.map(o => {
    if (JSON.stringify(regionCon) === JSON.stringify(o)) {
      return (
        <span onClick={ () => { handleFilter(regionWrap) } } className='regionCon' key={ `reg${ Math.random() }${ o.id }` } >
          { o.name }
        </span>
      )
    }
    return (
      <span onClick={ () => { handleRegion(o, defindcinemasData) } } key={ `reg${ Math.random() }${ o.id }` } >
        { o.name }
      </span>
    )
  })
  return (
    <div style={{ height: '100%' }} onClick={ () => { handleFilter(regionWrap) } }>
      <div className='regionwrap' onClick={ e => { e.stopPropagation() } }>
        <p>区域</p>
        <span onClick={ () => { handleRegion('', defindcinemasData) } }>全部</span>
        { districtList }
      </div>
    </div>
  )
}


// 影院列表组件
export const CinemaItem = cinema3 => {
  const { cinema = cinema3.data, goSelect, keys, searchKey } = cinema3
  const { id, name, address, distance, isRecent, minPrice, times } = cinema
  const clicklist = () => {
    const dianyingHistory = getStore('dianying_History') || []
    if (!dianyingHistory.some(o => o === searchKey)) {
      if (dianyingHistory.length >= 5) {
        dianyingHistory.splice(0, 1, searchKey)
      } else {
        dianyingHistory.push(0, 0, searchKey)
      }
    }
    setStore('dianying_History', dianyingHistory)
  }
  const patt = new RegExp(searchKey, 'gi')
  const spli = name.split(patt) || []
  const txt = name.match(patt) || []
  const arr = spli.map((o, i) => `${ o }<i>${ txt[i] || '' }</i>`)
  return (
    <div className='cinemaItem' onClick={ () => { if (goSelect) { goSelect(id, keys) } else { clicklist() } } }>
      { isRecent === 1 && <Icon className='usedIcon' type={ require('svg/dianying/shoucang.svg') } />}
      <div className='leftInfo'>
        <h4>
          { searchKey ? <span dangerouslySetInnerHTML={{ __html: arr.join('') }} /> : <span>{ name }</span> }
          { minPrice && <span className='price' ><i>{ minPrice }元</i>起</span> }
        </h4>
        <p>{ address }</p>
        <p>{ times }</p>
      </div>
      <div className='rightInfo'>
        <span>{ distance && `距您${ distance }` }</span>
      </div>
    </div>
  )
}


// 定位地址组件
const Location = ({ location, getLct, regionCon, cityId }) => {
  const { load, currentAddress } = location

  return (
    <div className='location' onClick={ () => { getLct(regionCon, cityId) } }>
      <Icon type={ require('svg/dianying/zhiding.svg') } />
      <p>{ !load && currentAddress ? currentAddress : '请稍后，正在定位中...' }</p>
      <span><Icon type={ require('svg/dianying/shuaxin.svg') } /></span>
    </div>
  )
}

export default Cinema
