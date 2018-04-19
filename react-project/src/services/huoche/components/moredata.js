
import React from 'react'
import { Icon } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'
// import { getStore } from '@boluome/common-lib'
import TimeList from './timelist.js'
import FilterCom from './filter.js'

import '../style/list.scss'
import line from '../img/line.png'
import time from '../img/time.svg'
import times from '../img/times.svg'
import pricesvg from '../img/price.svg'
import conditions from '../img/conditions.svg'
import timeh from '../img/timeh.svg'
import timesh from '../img/timesh.svg'
import priceh from '../img/priceh.svg'
import conditionsh from '../img/conditionsh.svg'
import notrain from '../img/notrain.png'

// const Item = List.Item
const Moredata = props => {
  const {
    scheduleslist, goDetails, scheduleslistFilter,
    chooseTime, onChangeTime,
    handleListScroll, botShow, nolist, notOnceList,
    handleMoreVotes, votesORprice,
    defiliterObj, filiterObj, handleDurationFilter, handleTimeFilter,
    isDrua, isTime, handleFilterResult, filterFn, gethandleFilter,
    oRisTime, oRisDrua, iSconditions,
    goGrabticket,
    ChangeSign, chooseCity, goCitySelect,
  } = props
  console.log('ChangeSign----', ChangeSign, chooseTime)
  const handleFilter = () => {
    Mask(<FilterCom
      defiliterObj={ defiliterObj }
      filiterObj={ filiterObj }
      scheduleslistFilter={ scheduleslistFilter }
      scheduleslist={ scheduleslist }
      handleFilterResult={ handleFilterResult }
      filterFn={ filterFn }
    />, { mask: true, style: { position: 'absolute' } })
  }
  return (
    <div className='ListPageWrap' onScroll={ e => handleListScroll(e.target.scrollTop, botShow) }>
      { chooseTime ? (
        <TimeList chooseTime={ chooseTime }
          onChangeTime={ onChangeTime }
          gethandleFilter={ gethandleFilter }
          filiterObj={ filiterObj }
          scheduleslist={ scheduleslist }
        />) : '' }
      {
        ChangeSign ? (<div className='goGrabBtn' onClick={ () => goCitySelect('End') }>变更到站</div>) : (<div className='goGrabBtn' onClick={ () => goGrabticket(chooseTime, chooseCity) }>{ `一票难求?${ ' ' }试试抢票${ ' ' }>` }</div>)
      }
      <div className='listWrap'>
        <ItemBlock
          scheduleslistFilter={ scheduleslistFilter }
          goDetails={ goDetails }
          votesORprice={ votesORprice }
          nolist={ nolist }
          goGrabticket={ goGrabticket }
          ChangeSign={ ChangeSign }
        />
      </div>
      <ConditionsItem
        handleFilter={ handleFilter }
        botShow={ botShow }
        handleMoreVotes={ handleMoreVotes }
        votesORprice={ votesORprice }
        handleDurationFilter={ handleDurationFilter }
        scheduleslist={ scheduleslist }
        scheduleslistFilter={ scheduleslistFilter }
        handleTimeFilter={ handleTimeFilter }
        isDrua={ isDrua }
        isTime={ isTime }
        oRisTime={ oRisTime }
        oRisDrua={ oRisDrua }
        iSconditions={ iSconditions }
        gethandleFilter={ gethandleFilter }
        notOnceList={ notOnceList }
      />
    </div>
  )
}

export default Moredata

// 列车车次
const ItemBlock = ({ scheduleslistFilter, goDetails, votesORprice, nolist, goGrabticket, ChangeSign }) => {
  if (scheduleslistFilter && scheduleslistFilter.length > 0) {
    // const { list } = scheduleslistFilter
    console.log('item--ssss-', scheduleslistFilter)
    return (
      <div className='list'>
        {
          scheduleslistFilter.map(item => (
            <ItemShowTrick key={ item.no } item={ item } votesORprice={ votesORprice } goDetails={ goDetails } goGrabticket={ goGrabticket } ChangeSign={ ChangeSign } />
          ))
        }
      </div>
    )
  }
  return (
    <div>
      {
        nolist === false ? (<div className='nolist'>
          <img src={ notrain } alt='' />
          <p>没有符合条件的车次，请更改条件之后重新搜索</p>
        </div>) : (<div />)
      }
    </div>
  )
}

// 车次展示数据
const ItemShowTrick = ({ item, votesORprice, goDetails, goGrabticket, ChangeSign }) => {
  const { no, from, startTime, number, duration, to, endTime, price, seats = [], saleDateTime = '' } = item
  let yes = true
  let text = '可抢票'
  for (let i = 0; i < seats.length; i++) {
    if (seats && seats[i].yupiao === 0) {
      yes = false
    }
  }
  if (saleDateTime) {
    yes = false
    text = '可预约'
  }
  if (ChangeSign && ChangeSign.indexOf('ChangeSign') > 0) {
    yes = true
  }
  return (
    <div className='listItem' key={ no } onClick={ () => { goDetails(item, ChangeSign) } }>
      <div className='item_t'>
        <div className='startTime'>
          <span className='addressSpan'>{ from }</span>
          <span className='timeSpan'>{ startTime }</span>
        </div>
        <div className='decTime'>
          <span>{ number }</span>
          <span><img src={ line } alt='---' /></span>
          <span>{ `${ Math.floor(duration / 60) }时${ Math.floor(duration % 60) }分` }</span>
        </div>
        <div className='endTime'>
          <span className='addressSpan'>{ to }</span>
          <span className='timeSpan'>{ endTime }</span>
        </div>
        <div className='price'>
          <span className='priceSpan'><i className='ii'>¥</i>{ price }<i>起</i></span>
          {
            yes ? ('') : (<span className='grabSpan' onClick={ () => { console.log(goGrabticket) } }>{ text }</span>)
          }
        </div>
      </div>
      {
        saleDateTime ? (<div className='item_b'><span style={{ color: '#ffab00', fontSize: '0.24rem' }}>{ `${ saleDateTime }，可预约抢票，开售即抢` }</span></div>) : (<ItemTrick seats={ seats } votesORprice={ votesORprice } />)
      }
    </div>
  )
}

// 列车座位
const ItemTrick = ({ seats, votesORprice }) => {
  return (
    <div className='item_b'>
      {
        seats.map(i => (
          <span key={ i.name }>{ i.name }: { votesORprice === 'price' ? `¥${ i.price }` : `${ i.yupiao }张` }</span>
        ))
      }
    </div>
  )
}

// 筛选等条件悬浮
const ConditionsItem = ({
  handleFilter, botShow, handleMoreVotes, votesORprice,
  handleDurationFilter, scheduleslist, handleTimeFilter,
  isTime, isDrua, scheduleslistFilter, gethandleFilter,
  oRisTime, oRisDrua, iSconditions, notOnceList,
}) => {
  if (notOnceList) {
    return (
      <div className='Conditions' style={ botShow ? {} : { bottom: '-1rem' } }>
        <div className={ iSconditions ? 'item' : '' } onClick={ () => { handleFilter() } }><Icon type={ iSconditions ? conditionsh : conditions } /><span>筛选</span></div>
        <div className={ oRisTime ? 'item' : '' } onClick={ () => handleTimeFilter(scheduleslist, isTime, scheduleslistFilter, gethandleFilter) }><Icon type={ oRisTime ? timesh : times } /><span>{ oRisTime ? (isTime ? '从早到晚' : '从晚到早') : '' }{ oRisTime === false ? '时间' : '' }</span></div>
        <div className={ oRisDrua ? 'item' : '' } onClick={ () => handleDurationFilter(scheduleslist, isDrua, scheduleslistFilter, gethandleFilter) }><Icon type={ oRisDrua ? timeh : time } /><span>{ oRisDrua ? (isDrua ? '从短到长' : '从长到短') : '' }{ oRisDrua === false ? '历时' : '' }</span></div>
        <div onClick={ () => handleMoreVotes(votesORprice) }><Icon type={ votesORprice === 'price' ? priceh : pricesvg } /><span className={ `${ votesORprice === 'price' ? 'price' : 'votes' }` }><i>余票／</i><i>票价</i></span></div>
      </div>
    )
  }
  return (<div />)
}
