
import React from 'react'
import { List, WhiteSpace, InputItem } from 'antd-mobile'

// import getDateArr from './getDate'
import AnnualCom from './annual'

import '../style/editCar.scss'
import basic from '../img/basic.png'
import annual from '../img/annual.png'
import illega from '../img/illega.png'
import key from '../img/key.png'

const Item = List.Item
const EditCar = editCar => {
  const { handleGoChegu, cheguChexi, prefix, currentIndex, keyData, plateNumber = [],
    changeCurrentIndex, changeCurrent, handleKeydown, handleInputValue, handleTimevalue,
    cityId, cityName, vin, engineNo, carPhone, time, id, vinLength, engineNoLength, handleOver,
    chexi, chexing,
  } = editCar
  // console.log('--EditData--', EditData, time, '--vinLength--', vinLength, '---engineNoLength---', engineNoLength)
  let datas
  if (currentIndex === 0) {
    datas = prefix
  } else if (currentIndex === 1) {
    datas = keyData.map(o => ({
      value:      o,
      selectedNo: prefix.filter(p => p.value === plateNumber[0])[0].children.some(c => c.value === o),
    }))
  } else {
    datas = keyData
  }
  const plateNumberL = plateNumber.slice(0, 2)
  const plateNumbers = plateNumberL.map((o, i) => {
    return (
      <span className={ currentIndex === i ? 'quSpan selectNow' : 'quSpan' } onClick={ e => { e.nativeEvent.stopImmediatePropagation(); changeCurrentIndex(i) } } key={ `keyboard-${ Math.random() }` }>{ o }</span>
    )
  })
  // console.log('-currentIndex---', datas, '--keyData---', keyData, '--plateNumbers--', plateNumbers)
  const session = { carPhone, cityId, cityName, plateNumber, vin, engineNo, time, cheguChexi, id }
  return (
    <div className='editWrap'>
      <div className='editMessage' onClick={ e => { e.stopPropagation() } } ref={ node => {
        if (node) {
          document.onclick = () => {
            changeCurrentIndex('')
          }
        }
      } }
      >
        <WhiteSpace size='lg' />
        <List>
          <BasicInfo
            handleGoChegu={ handleGoChegu }
            cheguChexi={ cheguChexi }
            plateNumbers={ plateNumbers }
            plateNumber={ plateNumber }
            changeCurrentIndex={ changeCurrentIndex }
            session={ session }
            currentIndex={ currentIndex }
          />
        </List>
        <WhiteSpace size='lg' />
        <List>
          <IllegalService
            vin={ vin }
            carPhone={ carPhone }
            engineNo={ engineNo }
            handleInputValue={ handleInputValue }
            vinLength={ vinLength }
            engineNoLength={ engineNoLength }
          />
        </List>
        <WhiteSpace size='lg' />
        <List>
          <Annual handleTimevalue={ handleTimevalue } value={ time } />
        </List>
        <WhiteSpace size='lg' />
      </div>
      <div className='editcarBtn' onClick={ () => handleOver(carPhone, cityId, cityName, plateNumber, vin, engineNo, time, chexi, chexing, cheguChexi, id) }>完成</div>
      { (currentIndex || currentIndex === 0) && [<Keyboard
        keyboard={ datas }
        plateNumber={ plateNumber }
        currentIndex={ currentIndex }
        changeCurrentIndex={ changeCurrentIndex }
        changeCurrent={ changeCurrent }
        handleKeydown={ handleKeydown }
      />] }
    </div>
  )
}

export default EditCar
const picStyle = {
  width:   '0.34rem',
  height:  'auto',
  display: 'inlineBlock',
}
const txtStyle = {
  fontWeight: '700',
}
const BasicInfo = ({ handleGoChegu, cheguChexi, plateNumbers, plateNumber, changeCurrentIndex, session, currentIndex }) => {
  const { model = '请选择车型车系' } = cheguChexi
  let text = model
  if (!model) {
    text = '请选择车型车系'
  }
  console.log('--cheguChexi---', cheguChexi)
  return (
    <div className='basic'>
      <Item
        thumb={ <img style={ picStyle } src={ basic } alt='' /> }
        arrow='empty'
        onClick={ () => {} }
      ><span style={ txtStyle }>基本信息</span></Item>
      <Item extra={ <span>小型汽车</span> }>车辆类型</Item>
      <Item className='chexi' extra={ <span className='spanOto' onClick={ () => handleGoChegu(session) }>{ text }</span> } arrow='horizontal'>车型车系</Item>
      <Item className='chepai' extra={ <ChepaiCom plateNumbers={ plateNumbers } plateNumber={ plateNumber } changeCurrentIndex={ changeCurrentIndex } currentIndex={ currentIndex } /> } arrow='empty'>车牌号码</Item>
    </div>
  )
}

const ChepaiCom = ({ plateNumbers, plateNumber, changeCurrentIndex, currentIndex }) => {
  const plateNumberR = plateNumber.slice(2)
  return (
    <div className='chepaiRDiv'>
      { plateNumbers }
      <div onClick={ e => { e.nativeEvent.stopImmediatePropagation(); changeCurrentIndex(2) } } style={ currentIndex >= 2 ? { borderBottom: '1px solid #ffab00' } : {} } className={ `${ plateNumberR.join('') ? 'plateNumberInt' : 'plateNumberInt plateNumberIntS' }` } >{ `${ plateNumberR.join('') ? plateNumberR.join(' ') : '请输入车牌号码' }` }</div>
    </div>
  )
}

const Keyboard = ({ keyboard = [], plateNumber, currentIndex, changeCurrentIndex, changeCurrent, handleKeydown }) => {
  const keylist = keyboard.map(value => {
    return (
      <li
        key={ `keyboard-${ Math.random() }` }
        className={ !value.selectedNo && currentIndex === 1 ? 'selectedNo' : '' }
        onClick={ e => { handleKeydown(e, plateNumber, currentIndex, value) } }
      >
        { value.value || value.value === 0 ? value.value : value }
      </li>
    )
  })

  return (
    <div className='keyboard'>
      <p><span onClick={ () => { changeCurrentIndex('') } }>确定</span></p>
      <ul>{ keylist }</ul>
      <span className='cancel' onClick={ e => { e.nativeEvent.stopImmediatePropagation(); changeCurrent(plateNumber, currentIndex) } }><img src={ key } alt='' /></span>
    </div>
  )
}

const IllegalService = ({ carPhone, engineNo, vin, handleInputValue, engineNoLength, vinLength }) => {
  const tel = carPhone.replace(/\s/g, '')
  return (
    <div className='server'>
      <Item
        thumb={ <img style={ picStyle } src={ illega } alt='' /> }
        arrow='empty'
        onClick={ () => {} }
      ><span style={ txtStyle }>违章服务</span></Item>
      <InputItem placeholder={ `${ vinLength === 0 || vinLength === 99 ? '请输入全部车架号' : `请输入后${ vinLength }位车架号` }` } value={ vin } onChange={ val => handleInputValue(val, 'vin') }>车架号</InputItem>
      <InputItem placeholder={ `${ engineNoLength === 0 || engineNoLength === 99 ? '请输入全部发动机号' : `请输入后${ engineNoLength }位发动机号` }` } value={ engineNo } onChange={ val => handleInputValue(val, 'engineNo') }>发动机号</InputItem>
      <InputItem placeholder='请输入车主电话' type='phone' maxLength='11' value={ tel } onChange={ val => handleInputValue(val, 'carPhone') }>手机号码</InputItem>
    </div>
  )
}

const Annual = ({ handleTimevalue, value }) => {
  return (
    <div className='annual'>
      <Item
        thumb={ <img style={ picStyle } src={ annual } alt='' /> }
        arrow='empty'
      ><span style={ txtStyle }>年检提醒</span></Item>
      <AnnualCom handleTimevalue={ handleTimevalue } value={ value } />
    </div>
  )
}
