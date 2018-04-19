import React from 'react'
import { browserHistory } from 'react-router'
import { DatePicker , List , Popup , Button , Toast } from 'antd-mobile';
import moment from 'moment';
import { Mask, SlidePage, CitySearch } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'

import '../style/index.scss'

const Item = List.Item;

const App = (props) => {

  let maskProps
  let showCities
  const { children } = props
  // const maxDate = moment('2017', 'YYYY')
  // const minDate = moment('1900', 'YYYY')
  const { year , currIndex , cx , area , dyVal , floor , sumFloor , buildingName , residentialareaName , city = {} , building, comparison } = props
  const { chooseCity , dyChange , floorChange , sumFloorChange , areaChange , ndChange , chooseCx , buildingChange , showCity } = props

  if(city && city.name){
    showCities = city.name
  } else if(showCity) {
    showCities = showCity
  } else {
    showCities = '请选择'
  }

  let inforArr = [showCities, residentialareaName , building , dyVal , floor , sumFloor , cx , area , year ];
  // const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
  // if (isIPhone) {
  //   // Note: the popup content will not scroll.
  //   maskProps = {
  //     onTouchStart: e => e.preventDefault(),
  //   };
  // }


  let clickEvaluation = (inforArr) => {
    // let inforArr = [showCities, residentialareaName , building , dyVal , floor , sumFloor , cx , area , year ];
    let cnArr = ['所在城市','小区名称', '楼号' ,'单元','居住楼层','总层数','朝向','建筑面积','建筑年代']
    inforArr.forEach((item,index) => {
      if(!item){
        Toast.info(cnArr[index] + '不能为空' , 1)
        return false
      }
    })
    for (var i = 0; i < inforArr.length; i++) {
      if(!inforArr[i]){
        Toast.info(cnArr[i] + '不能为空' , 1)
        return false
      }
    }
    if(comparison(floor, sumFloor)){
      browserHistory.push('/fanggu/result')
    }
  }

  let cxShow = () => {
    Popup.show(
    <div className='cxFloat'>
      <p>请选择朝向</p>
       {['东', '西', '南', '北', '东南', '东北', '西南' , '西北'].map((i, index) => (
         <span key={index} onClick={ () => onClose(i , index) }
          className={ currIndex === index ? 'cx cxChoose' : 'cx' } >{ i }</span>
       ))}
    </div>
    , { animationType: 'slide-up' });
  };

  let onClose = (i , index) => {
    // this.setState({ sel });
    chooseCx(i , index);
    // e.target.className += ' cxChoose'
    Popup.hide();
  };

  if( city && city.name ){
    setStore('chooseCity' , city.name , 'session')
  }

  let curl = /192.168.|localhost/.test(location.hostname)
                  ? 'https://dev-api.otosaas.com'
                  : `${location.origin}/api`

  let urls = curl + '/basis/v1/fanggu/fungugu/cities'

  const goCheckCity = () => {
    if(city && city.name || showCities){
      browserHistory.push('/fanggu/chooseDistrict')
    } else {
      Toast.info('请选择所在城市',2)
    }
  }

  const goCheckDistrict = () => {
    if(residentialareaName){
      browserHistory.push('/fanggu/chooseBuilde')
    } else {
      Toast.info('请选择小区名称',2)
    }
  }




  return(
    <div className='fromList'>
      <ul>
        <li className='city' style={{height:'auto'}} onClick={ () =>
          Mask(
            <SlidePage target='right' showClose={ false } >
              <CitySearch localCity={ JSON.parse(sessionStorage.currentPosition).city } callback = { (result) => chooseCity(result) } api = { urls } />
            </SlidePage>
          , { mask: false, style: { position: 'absolute' } })
        }>

          <Item arrow="horizontal" onClick={() => {}} extra={ showCities }>
            所在城市
          </Item>
        </li>
        <div className='margin24' />
        <li className='obecName heightAuto' onClick={ ()=> goCheckCity() }>
           <Item arrow="horizontal" extra={ residentialareaName ? residentialareaName : '请选择' }
            onChange={ (e) => obecChange(e.target.value) }>
             小区名称
           </Item>
        </li>



        <li>
          <span>楼栋</span>
          <div className='fright'>
            <input type='text' placeholder='请输入' onChange={ (e) => buildingChange(e.target.value) } value={ building } />
            <span>楼号</span>
          </div>
        </li>

        <li>
          <span>单元</span>
          <div className='fright'>
            <input type='text' placeholder='请输入' onChange={ (e) => dyChange( e.target.value ) } value={ dyVal } />
            <span>单元</span>
          </div>
        </li>

        <li className='floor'>
          <span>楼层</span>
          <div className='fright'>
            <div>
              <input type='tel' placeholder='请输入' onChange={ (e) => floorChange(e.target.value) }
                value={ floor } onBlur = { () => comparison() } />
              <span>层</span>
            </div>
            <div>
              <input type='tel' placeholder='请输入' onChange={ (e) => sumFloorChange(e.target.value) }
                value={ sumFloor }  onBlur = { () => comparison() } />
              <span>总楼层</span>
            </div>
          </div>
        </li>

        <li>
          <Item arrow="horizontal" extra={ cx ? cx : '请选择' } onClick={ (e) => { cxShow() ; e.target.blur()} }
           onChange={ (e) => cxChange(e.target.value) }>
            朝向
          </Item>
        </li>

        <li className='area'>
          <span>建筑面积</span>
          <div className='fright'>
            <input type='tel' placeholder='请输入' onChange={ (e) => areaChange(e.target.value) } value={ area } />
            <span>㎡</span>
          </div>
        </li>

        <li>
          <DatePicker mode="year" minDate={ moment('1950', 'YYYY') } maxDate={ moment('2017', 'YYYY') } defaultDate={ moment(new Date().getFullYear(), 'YYYY') } value={ year }
            format={ val => val.format('YYYY') } onChange={ (val) => ndChange(val) } >
            <List.Item arrow="horizontal">建筑年代</List.Item>
          </DatePicker>
        </li>
      </ul>
      <div className='btnBox'>
        <button className='btn' onClick={ () => clickEvaluation(inforArr) } >评估房源</button>
      </div>
    </div>
  )
}

export default App
