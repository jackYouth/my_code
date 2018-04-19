import React from 'react'
import { Icon } from 'antd-mobile'
import { Mask, SlidePage, Calendar, CitySearch, UserCenter } from '@boluome/oto_saas_web_app_component'
import { getStore, parseLocName } from '@boluome/common-lib'
import '../style/app.scss'

// const Item = List.Item

const App = app => {
  console.log(app)
  const { cityArr, fromCityobj, fromCity, toCity, date, qicheHistory = [], handletoCity, handlefromCity, handleTime, handleSwitch, handleClearhistory, handleSubmit } = app
  const dateSplit = date.split('-')
  const nowdate = new Date()
  const nowdatestr = nowdate.toLocaleDateString()
  const nowdatestrsplit = nowdatestr.split('/')
  const nextdate = new Date(`${ nowdatestrsplit[0] }/${ nowdatestrsplit[1] }/${ (nowdatestrsplit[2] * 1) + 1 }`)
  const nextdates = new Date(`${ nowdatestrsplit[0] }/${ nowdatestrsplit[1] }/${ (nowdatestrsplit[2] * 1) + 2 }`)
  const dates = new Date(date.replace(/-/g, '/'))
  let dateShow = ''
  if (dates.toLocaleDateString() === nowdate.toLocaleDateString()) {
    dateShow = '今天'
  } else if (dates.toLocaleDateString() === nextdate.toLocaleDateString()) {
    dateShow = '明天'
  } else if (dates.toLocaleDateString() === nextdates.toLocaleDateString()) {
    dateShow = '后天'
  } else {
    dateShow = `周${ ['日', '一', '二', '三', '四', '五', '六'][dates.getDay()] }`
  }
  const openCity = handleCity => {
    return (Mask(
      <SlidePage target='right' showClose={ false } >
        <CitySearch localCity={ getStore('currentPosition', 'session') ? parseLocName(getStore('currentPosition', 'session').city) : '上海' }
          categoryCode='qiche'
          handleCityData={ res => { handleCity(res) } }
          api={ cityArr }
        />
      </SlidePage>,
      { mask: false, style: { position: 'absolute' } }
    ))
  }
  return (
    <div className='app'>
      <UserCenter categoryCode='qiche' orderTypes='qiche' />
      <div className='addrcity'>
        <div onClick={ () => { openCity(handlefromCity) } }>
          <p>出发地</p>
          <p>{ fromCity }</p>
        </div>
        <Icon onClick={ () => { handleSwitch(fromCity, toCity) } } className='tipImg' type={ require('svg/qiche/switch.svg') } />
        <div onClick={ () => { openCity(handletoCity) } }>
          <p>目的地</p>
          { toCity }
        </div>
      </div>
      <div className='addrtime' onClick={
         () => {
           return (
             Mask(
               <SlidePage target='right' showClose={ false } >
                 <Selecttime handleTime={ handleTime } />
               </SlidePage>,
               { mask: false, style: { position: 'absolute' } }
             )
           )
         }
       }
      >
        <p>
          出发日期
        </p>
        <span>
          { dateSplit[1] < 10 ? `0${ parseInt(dateSplit[1], 10) }` : dateSplit[1] }月{ dateSplit[2] < 10 ? `0${ parseInt(dateSplit[2], 10) }` : dateSplit[2] }日
          { dateShow }
        </span>
      </div>

      <p className='btn'><span onClick={ () => { handleSubmit(fromCity, toCity, date, fromCityobj) } }>查询</span></p>

      { qicheHistory.length > 0 && <fieldset>
        <legend>最近查询</legend>
      </fieldset> }
      <ul className='locainfo'>
        {
          qicheHistory.length > 0 && qicheHistory.map(e => {
            return (
              <li onClick={ () => { handleSwitch(e.toCity, e.fromCity) } } key={ `${ e.fromCity }${ e.toCity }` } ><span>{ e.fromCity }</span><span>－</span><span>{ e.toCity }</span></li>
            )
          })
        }
      </ul>
      { qicheHistory.length > 0 && <p className='clear-locainfo' onClick={ () => { handleClearhistory() } }>清除全部</p> }
    </div>
  )
}

// 日历取消组件
const Selecttime = props => {
  const { handleContainerClose, handleTime } = props
  return (
    <Calendar pricearr={ [] } onChange={ res => { handleContainerClose(); handleTime(res) } } />
  )
}

export default App
