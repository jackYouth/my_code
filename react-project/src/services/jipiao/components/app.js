import React from 'react'
import { List, Icon } from 'antd-mobile'
import { Mask, SlidePage, Calendar, CitySearch, UserCenter } from '@boluome/oto_saas_web_app_component'
import { getStore, parseLocName } from '@boluome/common-lib'
import '../style/app.scss'

// const Vconsole = require('vconsole')
//
// const v = new Vconsole()
// console.log(v.ttest)

const Item = List.Item

const App = app => {
  console.log(app)
  const { cityHot, calenderdata, cityArr, fromCity, toCity, date, airticHistory = [], handletoCity, handlefromCity, handleTime, handleSwitch, handleClearhistory, handleSubmit, goLitelist } = app
  const dateSplit = date.split('-')
  const nowdate = new Date()
  const y = nowdate.getFullYear()
  const m = nowdate.getMonth()
  const d = nowdate.getDate()
  const nextdate = new Date(y, m, d + 1)
  const nextdates = new Date(y, m, d + 2)
  const dates = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2])
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
  return (
    <div className='app'>
      <UserCenter myClick={ cb => { goLitelist(cb) } } categoryCode='jipiao' orderTypes='jipiao' />
      <List>
        <Item className='addrcity'>
          <span onClick={ () => {
            return (Mask(
              <SlidePage target='right' showClose={ false } >
                <CitySearch localCity={ getStore('currentPosition', 'session') ? parseLocName(getStore('currentPosition', 'session').city) : fromCity }
                  categoryCode='jipiao'
                  handleCityData={ res => { handlefromCity(res, toCity) } }
                  api={ cityArr }
                  cityHot={ cityHot }
                />
              </SlidePage>,
              { mask: false, style: { position: 'absolute' } }
            ))
          } }
          >{ fromCity }</span>
          <Icon onClick={ () => { handleSwitch(fromCity, toCity) } } className='tipImg' type={ require('svg/jipiao/switch.svg') } />
          <span onClick={ () => {
            return (Mask(
              <SlidePage target='right' showClose={ false } >
                <CitySearch localCity={ getStore('currentPosition', 'session') ? parseLocName(getStore('currentPosition', 'session').city) : toCity }
                  categoryCode='jipiao'
                  handleCityData={ res => { handletoCity(res, fromCity) } }
                  api={ cityArr }
                  cityHot={ cityHot }
                />
              </SlidePage>,
              { mask: false, style: { position: 'absolute' } }
            ))
          } }
          >{ toCity }</span>
        </Item>
        <Item arrow='horizontal' onClick={
           () => {
             return (
               Mask(
                 <SlidePage target='right' showClose={ false } >
                   <Selecttime calenderdata={ calenderdata } handleTime={ handleTime } />
                 </SlidePage>,
                 { mask: false, style: { position: 'absolute' } }
               )
             )
           }
         }
        >
          { dateSplit[1] < 10 ? `0${ parseInt(dateSplit[1], 10) }` : dateSplit[1] }月{ dateSplit[2] < 10 ? `0${ parseInt(dateSplit[2], 10) }` : dateSplit[2] }日
          <span className='datetip'>
            { dateShow }
          </span>
        </Item>

        <p className='btn'><span onClick={ () => { handleSubmit(fromCity, toCity, date) } }>查询机票</span></p>
      </List>
      { airticHistory.length > 0 && <fieldset>
        <legend>最近查询</legend>
      </fieldset> }
      <ul className='locainfo'>
        {
          airticHistory.length > 0 && airticHistory.map(e => {
            return (
              <li onClick={ () => { handleSwitch(e.toCity, e.fromCity) } } key={ `${ e.fromCity }${ e.toCity }` } ><span>{ e.fromCity }</span><span>－</span><span>{ e.toCity }</span></li>
            )
          })
        }
      </ul>
      { airticHistory.length > 0 && <p className='clear-locainfo' onClick={ () => { handleClearhistory() } }>清除全部</p> }
    </div>
  )
}

// 日历取消组件
const Selecttime = props => {
  const { handleContainerClose, handleTime, calenderdata } = props
  return (
    <Calendar pricearr={ calenderdata || [] } onChange={ res => { handleContainerClose(); handleTime(res) } } />
  )
}

export default App

// <Picker title={ '选择舱位' } data={ dateArr } cols={ 1 } onChange={ res => { handleCabin(res) } } value={ cabin }>
//   <Item arrow='horizontal'>选择舱位</Item>
// </Picker>
