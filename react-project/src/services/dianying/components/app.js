import React from 'react'
import { Icon, Tabs } from 'antd-mobile'
import { UserCenter, Mask, Supplier, SlidePage, CitySearch } from '@boluome/oto_saas_web_app_component'
import { getStore, setStore, parseLocName } from '@boluome/common-lib'
// import { get } from 'business'
import LazyLoad, { forceCheck } from 'react-lazyload'
// import { vconsole } from 'vconsole'
import '../style/app.scss'
// import emp from '../img/empstar.png'
// import fill from '../img/fillstar.png'
// import part from '../img/partstar.png'
import imax from '../img/imax.png'
import imaxs from '../img/imaxs.png'
import sand from '../img/sand.png'

const TabPane = Tabs.TabPane

const App = app => {
  // console.log(app)
  const { regionCon, regionWrap, keys, channel, cityName, cityId, location, hotData, comData, comMonthData, comMonthDate, cinemaData, defindcinemaData, getLct, callback, handleChannel, handleRegion, handleChangeMonth, goDetail, goCinema, goSelect, goLitelist } = app

  const hotList = hotData && hotData.length > 0 && hotData.map(o => <ListItem key={ `hot${ o.id }` } datail={ o } goDetail={ goDetail } goCinema={ goCinema } />)
  const comList = comData && comData.reduce((arr, { date, films }) => {
    arr.push(<p key={ `date${ Math.random() }` } className='listTitle'>{ date }</p>)
    return arr.concat(
      films.map(o => <ListItem key={ `com${  o.id }` } datail={ o } goDetail={ goDetail } goCinema={ goCinema } />)
    )
  }, [])

  const cinemaList = cinemaData && cinemaData.length > 0 && cinemaData.map(o => <CinemaItem key={ `cinema${ o.id }` } goSelect={ goSelect } cinema={ o } />)

  return (
    <div className='apps'>
      <UserCenter categoryCode='dianying' orderTypes='dianying' myClick={ cb => { goLitelist(cb) } } />
      <Supplier categoryCode='dianying' onChange={ result => handleChannel(result, cityName, channel) } />
      <SearchTitle app={ app } />
      <div className='tabs' style={{ height: 'calc(100% - 0.8rem)' }}>
        { regionWrap && <SlidePage target='rigght' showClose={ false } showHash={ false }><Region app={ app } /></SlidePage> }
        <Tabs defaultActiveKey={ `${ keys }` } swipeable={ false } animated={ false } onChange={ key => callback(key, channel, cityId, regionCon) } style={{ height: '100%', backgroundColor: '#fff' }} activeUnderlineColor='#ff9a00' activeTextColor='#ff9a00' >
          <TabPane tab='热映' key='hot'>
            <div className='overWrap' onScroll={ () => { forceCheck() } }>
              { hotList }
              { hotData && hotData.length === 0 && <None txt='该地区暂无热映影片信息哦~~' /> }
            </div>
          </TabPane>
          <TabPane tab='待映' key='coming'>
            <div className='overWrap' onScroll={ () => { forceCheck() } }>
              <MonthComing comMonthData={ comMonthData } comMonthDate={ comMonthDate } handleChangeMonth={ handleChangeMonth } goDetail={ goDetail } />
              { comList }
            </div>
          </TabPane>
          <TabPane tab='影院' key='cinema'>
            <div className='overWrap' style={{ paddingBottom: '0.8rem', boxSizing: 'border-box' }} onScroll={ () => { forceCheck() } }>
              { regionCon && <div className='clearRegion'><Icon type={ require('svg/dianying/shaixuaned.svg') } />当前选择区域：{ regionCon.name }<p><span onClick={ () => { handleRegion('', defindcinemaData) } }>清除地址</span></p></div> }
              { cinemaList }
              { cinemaData && cinemaData.length === 0 && <None txt='该地区暂无影院信息哦~~' />}
            </div>
          </TabPane>
        </Tabs>
        { keys === 'cinema' && <Location location={ location } getLct={ getLct } /> }
      </div>
    </div>
  )
}

// 电影列表组件
export const ListItem = lidata => {
  const { datail = lidata.data, goDetail, goCinema, searchKey } = lidata
  const { name, director, pic, score, actor, dimension, hasImax, isOnShow } = datail
  let tip
  if (dimension === '3D' && hasImax) {
    tip = <img alt='3Dimax' style={{ width: '1rem', height: '0.3rem' }} src={ imax } />
  } else if (dimension === '2D' && hasImax) {
    tip = <img alt='2Dimax' style={{ width: '1rem', height: '0.3rem' }} src={ imaxs } />
  } else if (dimension === '3D') {
    tip = <img alt='3D' style={{ width: '0.4rem', height: '0.3rem' }} src={ sand } />
  } else {
    tip = <i />
  }
  let btn
  if (isOnShow === 1) {
    btn = <span className='buying'>购票</span>
  } else if (isOnShow === 2) {
    btn = <span className='buyed'>预售</span>
  } else {
    btn = <span className='buyno'>查看</span>
  }
  const clicklist = () => {
    const dianyingHistory = getStore('dianying_History') || []
    if (!dianyingHistory.some(o => o === searchKey)) {
      if (dianyingHistory.length >= 5) {
        dianyingHistory.splice(0, 1, searchKey)
      } else {
        dianyingHistory.splice(0, 0, searchKey)
      }
    }
    setStore('dianying_History', dianyingHistory)
  }
  const save = () => {
    if (searchKey) clicklist()
  }
  const patt = new RegExp(searchKey, 'gi')
  const spli = name.split(patt) || []
  const txt = name.match(patt) || []
  const arr = spli.map((o, i) => `${ o }<i>${ txt[i] || '' }</i>`)
  return (
    <div className='listitem' onClick={ () => { if (isOnShow) { save(); goDetail(datail) } else { save(); goDetail(datail, true) } } }>
      <div className='pic'>
        <LazyLoad height={ '100%' }>
          <img alt='电影' src={ pic } />
        </LazyLoad>
      </div>

      <div className='info'>

        <h1>{ searchKey ? <span dangerouslySetInnerHTML={{ __html: arr.join('') }} /> : <span>{ name }</span> }{ tip }</h1>
        <Star score={ score } />
        <div className='rightBot'>
          <div className='actorInfo'>
            { director && <p> 导演：{ director } </p> }
            { actor && <p> 主演：{ actor } </p> }
          </div>

          <div className='buyBtn' onClick={ e => { if (isOnShow) { e.stopPropagation(); save(); goCinema(datail) } else { e.stopPropagation(); save(); goDetail(datail, true) } } }>
            { btn }
          </div>
        </div>

      </div>
    </div>
  )
}

// 分月份显示待映影片
const MonthComing = ({ comMonthData, comMonthDate, handleChangeMonth, goDetail }) => {
  if (comMonthData && comMonthDate) {
    const titleList = comMonthData.map((o, i) => <span className={ (o.month === comMonthDate) ? 'monthSelect' : '' } key={ `comtitle${ i * Math.random() }` } onClick={ () => { handleChangeMonth(o.month, comMonthDate) } }>{ o.month }</span>)
    const felmData = comMonthData.filter(item => {
      if (item.month === comMonthDate) {
        return true
      }
      return false
    })
    const felmList = felmData[0].films.map((o, i) => <div onClick={ () => { if (o.isOnShow) { goDetail(o) } else { goDetail(o, true) } } } key={ `comfilm${ i * Math.random() }` }><img alt='影片' src={ `${ o.pic }` } /><h4>{ o.name }</h4><p>{ o.publishTime }</p></div>)
    return (
      <div className='comMonthList'>
        <div className='felmTitle'>
          <div>
            <h4>近期待映</h4>
            <p>近2个月最受期待影片</p>
          </div>
          { titleList }
        </div>
        <div className='felmList' onTouchMove={ e => { e.stopPropagation() } } onTouchEnd={ e => { e.stopPropagation() } } onTouchStart={ e => { e.stopPropagation() } }>
          { felmList }
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}

// 星级评分组件
const Star = ({ score }) => {
  // const dnum = Math.round(score)
  // const list = []
  // for (let i = 1; i <= 5; i++) {
  //   const num = i * 2
  //   let typeNum
  //   if (dnum >= num) {
  //     typeNum = fill
  //   } else if (dnum > (num - 2)) {
  //     typeNum = part
  //   } else {
  //     typeNum = emp
  //   }
  //   list.push(<img alt='星星' key={ `star${ Math.random() }` } src={ typeNum } />)
  // }
  // <div className='star'>
  //   { list }
  //   <span>{ score }</span>
  // </div>
  return (
    <div className='star'>
      { (score * 1) ? '' : '暂无评分' }<span>{ (score * 1) ? `${ score }分` : '' }</span>
    </div>
  )
}

// 影院列表组件
export const CinemaItem = cinema3 => {
  const { cinema = cinema3.data, goSelect, searchKey } = cinema3
  const { name, address, distance, isRecent, price } = cinema
  const clicklist = () => {
    const dianyingHistory = getStore('dianying_History') || []
    if (!dianyingHistory.some(o => o === searchKey)) {
      if (dianyingHistory.length >= 5) {
        dianyingHistory.splice(0, 1, searchKey)
      } else {
        dianyingHistory.splice(0, 0, searchKey)
      }
    }
    setStore('dianying_History', dianyingHistory)
  }
  const save = () => {
    if (searchKey) clicklist()
  }
  const patt = new RegExp(searchKey, 'gi')
  const spli = name.split(patt) || []
  const txt = name.match(patt) || []
  const arr = spli.map((o, i) => `${ o }<i>${ txt[i] || '' }</i>`)
  return (
    <div className='cinemaItem' onClick={ () => { save(); goSelect(cinema) } }>
      { isRecent === 1 && <Icon className='usedIcon' type={ require('svg/dianying/shoucang.svg') } />}
      <div className='leftInfo'>
        <h4>
          { searchKey ? <span dangerouslySetInnerHTML={{ __html: arr.join('') }} /> : <span>{ name }</span> }
          { price && <span className='price' ><i>{ price }元</i>起</span> }
        </h4>
        <p>{ address }</p>
      </div>
      <div className='rightInfo'>
        <span>{ distance && `距您${ distance }` }</span>
      </div>
    </div>
  )
}


// 定位地址组件
const Location = ({ location, getLct }) => {
  const { load, currentAddress } = location

  return (
    <div className='location' onClick={ () => { getLct() } }>
      <Icon type={ require('svg/dianying/zhiding.svg') } />
      <p>{ !load && currentAddress ? currentAddress : '请稍后，正在定位中...' }</p>
      <span><Icon type={ require('svg/dianying/shuaxin.svg') } /></span>
    </div>
  )
}

// 顶部搜索组件
const SearchTitle = ({ app }) => {
  const { cityHot, channel, keys, cityArr, cityName, regionCon, regionWrap, handleFilter, handleCity, goSearchall } = app
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
                handleCityData={ result => { handleCity(result, keys) } }
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
      <form className='search' onClick={ () => { handleFilter(true); goSearchall(channel) } }>
        <Icon type={ require('svg/dianying/sousuo.svg') } />
        <span className='input'>查找影片、影院名称</span>
      </form>
      { keys === 'cinema' && <p onClick={ () => { handleFilter(regionWrap) } }><Icon type={ regionCon ? require('svg/dianying/shaixuaned.svg') : require('svg/dianying/shaixuan.svg') } /></p> }
    </div>
  )
}

// 空白组件
const None = props => {
  const { txt } = props
  return (
    <div className='noCinemas'>
      <div className='noCinemasdiv'>
        <Icon type={ require('svg/dianying/NO.svg') } />
        <p>{ txt }</p>
      </div>
    </div>
  )
}


// 筛选列表组件
const Region = ({ app }) => {
  const { regionWrap, regionCon, defindcinemaData, districts, handleRegion, handleFilter } = app
  const districtList = districts && districts.map(o => {
    if (JSON.stringify(regionCon) === JSON.stringify(o)) {
      return (
        <span onClick={ () => { handleFilter(regionWrap) } } className='regionCon' key={ `reg${ Math.random() }` } >
          { o.name }
        </span>
      )
    }
    return (
      <span onClick={ () => { handleRegion(o, defindcinemaData) } } key={ `reg${ Math.random() }` }>
        { o.name }
      </span>
    )
  })

  return (
    <div style={{ height: '100%' }} onClick={ () => { handleFilter(regionWrap) } }>
      <div className='regionwrap' onClick={ e => { e.stopPropagation() } }>
        <p>区域</p>
        <span onClick={ () => { handleRegion('', defindcinemaData) } }>全部</span>
        { districtList }
      </div>
    </div>
  )
}


export default App

// { keys !== 'cinema' && <div className='searchTitle'><span className='mainCity' onClick={ () => { handleFilter(true); return (Mask(<SlidePage target='right' showClose={ false } ><CitySearch localCity={ getStore('currentPosition', 'session') ? parseLocName(getStore('currentPosition', 'session').city) : cityName } categoryCode='dianying' handleCityData={ result => { handleCity(result, keys) } } api={ cityArr } /></SlidePage>, { mask: false, style: { position: 'absolute' } })) } }><Icon type={ require('svg/dianying/dingwei.svg') } />{ cityName }<Icon type={ require('svg/dianying/arrowdown.svg') } /></span></div> }
