import React from 'react'
import { List, WhiteSpace, Icon, Switch } from 'antd-mobile'
import { Mask, SlidePage, Calendar, UserCenter, Supplier } from '@boluome/oto_saas_web_app_component'
// import { get } from 'business'
// import vconsole from 'vconsole'

import '../style/index.scss'
import transform from '../img/transform.svg'

const Item = List.Item
const App = props => {
  const {
    nowChecked, handleCheckedFn, handleCalendarDate, chooseTime,
    handleTransform,
    goListFn, history, chooseCity, goCitySelect,
    hanndleCleanHistory, handleChooseHist, myClick, handleChangeChannel,
  } = props
  // console.log('--test---4--chooseCity', chooseCity)
  // 选择日期
  const handleCalendarFn = () => {
    Mask(
      <SlidePage target='right' showClose={ false } >
        <Calendar onChange={ res => handleCalendarDate(res) } untilDay={ 60 } vipDay={ 28 } />
      </SlidePage>
    , { mask: false, style: { position: 'absolute' } })
  }
  // <div onClick={ () => handleSelectTrain() }>去抢票确认页面</div>
  return (
    <div className='huoCheWrap'>
      <UserCenter categoryCode='huoche' myClick={ myClick } />
      <Supplier categoryCode='huoche' onChange={ result => handleChangeChannel(result) } />
      <WhiteSpace size='lg' />
      <List>
        <div className='chooseAddr'>
          <div className='start' onClick={ () => { goCitySelect('Start') } }>{ chooseCity.from }</div>
          <div className='transform' onClick={ () => handleTransform(chooseCity) }><Icon type={ transform } /></div>
          <div className='end' onClick={ () => { goCitySelect('End') } }>{ chooseCity.to }</div>
        </div>
        {
          chooseTime ? (<Item className='chooseTime' arrow='horizontal' onClick={ () => { handleCalendarFn() } }><span>{ chooseTime.dateShow }</span><i>{ chooseTime.weed }</i></Item>) : ('')
        }
        <Item
          extra={ <Switch
            checked={ nowChecked }
            onClick={ checked => { handleCheckedFn(checked) } }
          /> }
        >
         只查高铁动车</Item>
        <div className='inquireBtn'>
          <div className='btn' onClick={ () => goListFn(chooseTime, chooseCity, 'golist') }>查询火车票</div>
        </div>
        <div className='grabTicket'>
          <div className='GrabBtn' onClick={ () => goListFn(chooseTime, chooseCity, 'goGrab') }>{ `一票难求?${ ' ' }试试抢票${ ' ' }>` }</div>
        </div>
      </List>
      <Historical history={ history } hanndleCleanHistory={ hanndleCleanHistory } handleChooseHist={ handleChooseHist } />
    </div>
  )
}

export default App

const Historical = ({ history, hanndleCleanHistory, handleChooseHist }) => {
  if (history && history.length > 0) {
    const data = history // .reverse() ------这里会改变原数组
    return (
      <div className='historicalWrap'>
        <div className='title'>
          <span className='line' /><span className='text'>最近查询</span><span className='line' />
        </div>
        <div className='history'>
          {
            data.map((o, i) => (
              <span onClick={ () => handleChooseHist(o) } key={ `${ o.from + i }${ o.to + i }` }>{ `${ o.from } - ${ o.to }` }</span>
            ))
          }
        </div>
        <div className='clearBtn' onClick={ () => hanndleCleanHistory() }>清除全部</div>
      </div>
    )
  }
  return (<div />)
}
