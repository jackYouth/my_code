import React, { Component } from 'react'
import { Icon } from 'antd-mobile'
import { SlidePage, Mask, Calendar } from '@boluome/oto_saas_web_app_component'
// import { keys } from 'ramda'
import qiche from '../img/qiche.png'
import chezhan from '../img/chezhan.png'
import shi from '../img/shi.png'
import zhong from '../img/zhong.png'
import time from '../img/time.png'
import '../style/air.scss'

const Air = air => {
  console.log(air)
  const { botShow, filiterObj, defiliterObj, defineQcdata = [], date, qcdata = [], station, handleFilternear, handleTime, handleScroll, goOrder } = air
  const modal = keyText => {
    return (
      Mask(
        <SlidePage target='down' showClose={ false }>
          <Filtercom air={ air } keyText={ keyText } />
        </SlidePage>,
        { mask: false, style: { position: 'absolute' } }
      )
    )
  }
  return (
    <div className='air'>
      <div className='qctop'>
        { date && <Airdate date={ date } filiterObj={ filiterObj } handleTime={ handleTime } /> }
      </div>
      <div className='qclistWarp'>
        <div className='qclistw' onScroll={ e => handleScroll(e.target.scrollTop, botShow) }>
          { station && <p className='station'>
            <span><img alt='站点' src={ chezhan } />离我最近的出发车站：<i>{ station }</i></span>
            <span onClick={ () => { handleFilternear(filiterObj, defineQcdata, station) } }>从此站出发</span>
          </p> }
          {
            defineQcdata.length === 0 &&
            <div className='empShop'>
              <div>
                <img alt='暂无航班信息' src={ qiche } />
                <p>没有符合条件的航班，请更改筛选条件~</p>
              </div>
            </div>
          }
          {
            qcdata.length > 0 && qcdata.map(e => <Airlist key={ `${ Math.random() }` } goOrder={ goOrder } data={ e } />)
          }
        </div>
      </div>
      { defiliterObj && <div className='selectAir' style={ botShow ? {} : { bottom: '-1rem' } }>
        <p style={ filiterObj.fromArr.some(e => e.choose === true) ? { color: '#ffab00' } : {} } onClick={ () => { modal('fromArr') } }>
          <span><img alt='始发' src={ shi } /></span>
          出发车站
        </p>
        <p style={ filiterObj.toArr.some(e => e.choose === true) ? { color: '#ffab00' } : {} } onClick={ () => { modal('toArr') } }>
          <span><img alt='终点' src={ zhong } /></span>
          到达车站
        </p>
        <p style={ filiterObj.dptTime.some(e => e.choose === true) ? { color: '#ffab00' } : {} } onClick={ () => { modal('dptTime') } }>
          <span><img alt='发时' src={ time } /></span>
          出发时段
        </p>
      </div> }
    </div>
  )
}

const Airdate = ({ date, filiterObj, handleTime }) => {
  const timesplit = date.split('-')
  const preDate = new Date()
  const presplit = preDate.toLocaleDateString().split('/')
  const nextDate = new Date()
  nextDate.setFullYear(presplit[0], (presplit[1] * 1) + 2, 0)
  const nowDate = new Date(date.replace(/-/g, '/'))
  const nowShow = `${ timesplit[1] }月${ timesplit[2] }日  周${ ['日', '一', '二', '三', '四', '五', '六'][nowDate.getDay()] }`
  return (
    <div className='airdate'>
      <div className='pre_date'>
        <Icon type={ require('svg/qiche/arrowleftd.svg') } />
        <div onClick={ () => { if (preDate.toLocaleDateString() !== nowDate.toLocaleDateString()) { handleTime(`${ timesplit[0] }-${ timesplit[1] }-${ (timesplit[2] * 1) - 1 }`, filiterObj) } } }>
          <p style={ (preDate.toLocaleDateString() === nowDate.toLocaleDateString()) ? { color: '#999999' } : {} }>前一天</p>
        </div>
      </div>
      <div className='now_date' onClick={
         () => {
           return (
             Mask(
               <SlidePage target='right' showClose={ false } >
                 <Selecttime handleTime={ handleTime } filiterObj={ filiterObj } />
               </SlidePage>,
               { mask: false, style: { position: 'absolute' } }
             )
           )
         }
       }
      >{ nowShow }<Icon type={ require('svg/qiche/arrowdown.svg') } /></div>
      <div className='next_date'>
        <div onClick={ () => { if (nowDate.toLocaleDateString() !== nextDate.toLocaleDateString()) { handleTime(`${ timesplit[0] }-${ timesplit[1] }-${ (timesplit[2] * 1) + 1 }`, filiterObj) } } }>
          <p style={ (nowDate.toLocaleDateString() === nextDate.toLocaleDateString()) ? { color: '#999999' } : {} }>后一天</p>
        </div>
        <Icon type={ require('svg/qiche/arrowrightd.svg') } />
      </div>
    </div>
  )
}

// 日历取消组件
const Selecttime = props => {
  const { handleContainerClose, handleTime, filiterObj } = props
  return (
    <Calendar pricearr={ [] } onChange={ res => { handleContainerClose(); handleTime(res.date, filiterObj) } } />
  )
}

// 航班列表组件
const Airlist = ({ data, goOrder }) => {
  const { departureStation, departureTime, arriveStation, shiftType, ticketPrice, ticketLeft } = data
  const shiftText = ['固定班', '流水班', '加班车']
  return (
    <div className='qc_list' onClick={ () => { goOrder(data) } }>
      <h3>{ departureTime }</h3>
      <div>
        <p><span><i className='shizhong' style={{ background: '#ffab00' }}>始</i>{ departureStation }</span><span>¥{ ticketPrice }</span></p>
        <p><span><i className='shizhong'>终</i>{ arriveStation }</span></p>
        <p className='type'><span>{ shiftText[shiftType] }</span><span>{ ticketLeft }张</span></p>
      </div>
    </div>
  )
}

// 筛选组件
class Filtercom extends Component {
  constructor(props) {
    super(props)
    const { filiterObj } = this.props.air
    this.state = {
      filiterObjing: JSON.parse(JSON.stringify(filiterObj)),
    }
  }

  handleChange(txt, i) {
    const { filiterObjing } = this.state
    const nub = filiterObjing[txt].map(e => {
      if (i >= 0 && e.name === filiterObjing[txt][i].name) {
        e.choose = true
      } else {
        e.choose = false
      }
      return e
    })
    filiterObjing[txt] = nub
    this.setState({ filiterObjing })
  }

  render() {
    const { handleContainerClose, air, keyText } = this.props
    const { defiliterObj, defineQcdata = [], filiterObj, qcdata, handleFilterback } = air
    const { filiterObjing } = this.state
    return (
      <div className='filterwrap' onClick={ () => { handleContainerClose() } }>
        <div className='filterlist' onClick={ e => { e.stopPropagation() } }>
          <p className='filterli'>
            <span onClick={ () => { handleContainerClose() } }>取消</span>
            <span style={{ color: '#ffab00' }} onClick={ () => { handleFilterback(defiliterObj, defineQcdata, filiterObj, qcdata, filiterObjing, handleContainerClose) } }>确定</span>
          </p>
          <p className='filterli' onClick={ () => { this.handleChange(keyText, -1) } }>
            <span>{ keyText === 'dptTime' ? '全部时段' : '全部车站' }</span>
            <Icon type={ filiterObjing[keyText].some(e => e.choose === true) ? require('svg/qiche/selcetno.svg') : require('svg/qiche/selceting.svg') } />
          </p>
          {
            (filiterObjing[keyText].length > 0) && filiterObjing[keyText].map((e, i) => {
              return (
                <p key={ `${ Math.random() }` } className='filterli' onClick={ () => { this.handleChange(keyText, i) } }>
                  <span>{ e.name }</span>
                  <Icon type={ e.choose === true ? require('svg/qiche/selceting.svg') : require('svg/qiche/selcetno.svg') } />
                </p>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Air
