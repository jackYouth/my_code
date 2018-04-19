import React from 'react'
import moment from 'moment';
import { browserHistory } from 'react-router'
import { DatePicker , List , Popup , Button, Icon , Toast} from 'antd-mobile'
import { Mask, SlidePage, CitySearch } from '@boluome/oto_saas_web_app_component'
import { carType } from './carType'
import { setStore, parseLocName, getStore } from '@boluome/common-lib'
import { Lifecycle } from 'react-router'
import './style/index.scss'

const Item = List.Item;

const App = (props) => {

  console.log('props------------',props);

  const { chooseCity, dateChange, distanceChange, check } = props

  const { chooseHistory, chooseResult, distance, city = {}, currentCity = {}, date } = props

  let maxYear
  let minYear
  if(chooseResult){
    maxYear = chooseResult.maxYear + '-' + (new Date().getMonth() + 1)
    minYear = chooseResult.minYyear
  }

  let btnCanUse = false
  let carInfo
  if (chooseResult) {
    carInfo = chooseResult
  } else if (chooseHistory) {
    carInfo = chooseHistory
  } else {
    carInfo = ''
  }

  if(city.name && date && distance || currentCity.name && date && distance){
    btnCanUse = true
  }

  let showCity
  if (city && city.name) {
    showCity = city.name
  } else if (currentCity && currentCity.name) {
    showCity = currentCity.name
  } else {
    showCity = '请选择'
  }
  // console.log('faweojfewjofwoeijajofiwa------->', minYear, maxYear)
  return(
    <div>
      <div className='formList'>
        <ul>

          <li onClick={ () => browserHistory.push('/chegu/carType') }>
            <Item arrow="horizontal" extra={ carInfo.wholeModelName ? carInfo.wholeModelName : '请选择' }>
              车辆型号
            </Item>
          </li>

          <li className='city' style={{height:'auto'}} onClick={ () =>
            Mask(
              <SlidePage target='right' showClose={ false } >
                <CitySearch localCity={ JSON.parse(sessionStorage.currentPosition).city } handleCityData = { (result) => chooseCity(result) } api = { '/basis/v1/chegu/cheth/cities' } />
              </SlidePage>
            , { mask: false, style: { position: 'absolute' } })
          }>

            <Item arrow="horizontal"  extra={ showCity }>
              所在城市
            </Item>
          </li>

          <li>
            <DatePicker mode="month" value={ date } minDate={ minYear ? moment(minYear, 'YYYY-MM') : '' } maxDate={ maxYear ? moment(maxYear, 'YYYY-MM') : '' }
              format={ val => val.format('YYYY-MM') } onChange={ (val) => dateChange(val) } >
              <List.Item arrow="horizontal">首次上牌</List.Item>
            </DatePicker>
          </li>

          <li className='distance'>
            <span>行驶里程</span>
            <div className='fRight'>
              <input type='tel' placeholder='请输入' maxLength='6' onChange={ (e) => distanceChange(e.target.value) } value={ distance ? distance : '' } />
              <span>公里</span>
            </div>
          </li>

        </ul>
      </div>
      <div className='btnBox'>
        <button className={ btnCanUse ? 'btn canUse' : 'btn' } disabled={ btnCanUse ? false : true }
          onClick = { () => check( props ) } >开始估值</button>
      </div>
    </div>
  )
}

export default App
