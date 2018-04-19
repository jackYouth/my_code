import React, { Component } from 'react'
import { Icon, Popup } from 'antd-mobile'
import { SlidePage, Mask, Calendar } from '@boluome/oto_saas_web_app_component'
import { keys } from 'ramda'
import feiji from '../img/feiji.png'
import '../style/air.scss'

const Air = air => {
  console.log(air)
  const { botShow, date, noAir, calenderdata, airdata, defineAirdata, filiterObj, defiliterObj, timeSort, priceSort, handleScroll, handleTime, handleFilterback, handleSort, goDetail } = air
  const onMaskClose = () => {
    console.log('onMaskClose')
  }
  if (defineAirdata && defineAirdata.length > 0) {
    let filting = false
    // for (let e in filiterObj) {
    //   for (let i = 0; i < filiterObj[e].length; i++) {
    //     if (filiterObj[e][i].choose) {
    //       filting = true
    //     }
    //   }
    // }
    keys(filiterObj).forEach(o => {
      filiterObj[o].forEach(oo => {
        if (oo.choose) filting = true
      })
    })
    return (
      <div className='air'>
        <div className='airtop'>
          <Airdate date={ date } calenderdata={ calenderdata } handleTime={ handleTime } />
        </div>
        <div className='airlistWarp'>
          <div className='airlistw' onScroll={ e => handleScroll(e.target.scrollTop, botShow) }>
            {
              airdata.length === 0 &&
              <div className='empShop'>
                <div>
                  <img alt='暂无航班信息' src={ feiji } />
                  <p>没有符合条件的航班，请更改筛选条件~</p>
                </div>
              </div>
            }
            {
              airdata && airdata.map(e => <Airlist key={ `${ e.departureDate }${ e.departureTime }${ e.flightNum }` } goDetail={ goDetail } data={ e } />)
            }
          </div>
          <div className='selectAir' style={ botShow ? {} : { bottom: '-1rem' } }>
            <p style={ filting ? { color: '#ffab00' } : {} } onClick={ () => { Popup.show(<Filter timeSort={ timeSort } priceSort={ priceSort } handleFilterback={ handleFilterback } defineAirdata={ defineAirdata } defiliterObj={ defiliterObj } filiterObj={ filiterObj } onClose={ () => Popup.hide() } />, { animationType: 'slide-up', onMaskClose }) } }>
              <Icon type={ filting ? require('svg/jipiao/filtering.svg') : require('svg/jipiao/filter.svg') } />
              筛选
            </p>
            <p style={ typeof timeSort === 'boolean' ? { color: '#ffab00' } : {} } onClick={ () => { handleSort(timeSort, priceSort, 'timeSort', airdata) } }>
              <Icon type={ typeof timeSort === 'boolean' ? require('svg/jipiao/timing.svg') : require('svg/jipiao/time.svg') } />
              {
                typeof timeSort === 'boolean' ? (timeSort ? '时间从早到晚' : '时间从晚都早') : '时间'
              }
            </p>
            <p style={ typeof priceSort === 'boolean' ? { color: '#ffab00' } : {} } onClick={ () => { handleSort(timeSort, priceSort, 'priceSort', airdata) } }>
              <Icon type={ typeof priceSort === 'boolean' ? require('svg/jipiao/pricing.svg') : require('svg/jipiao/price.svg') } />
              {
                typeof priceSort === 'boolean' ? (priceSort ? '票价从低到高' : '票价从高到低') : '票价'
              }
            </p>
          </div>
        </div>
      </div>
    )
  } else if (defineAirdata) {
    return (
      <div className='air'>
        <div className='airtop'>
          <Airdate date={ date } calenderdata={ calenderdata } handleTime={ handleTime } />
        </div>
        <div className='airlistWarp'>
          <div className='empShop'>
            <div>
              <img alt='暂无航班信息' src={ feiji } />
              <p>没有符合条件的航班，请更改条件后重新搜索</p>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (noAir) {
    return (
      <div className='air'>
        <div className='empShop'>
          <div>
            <img alt='暂无航班信息' src={ feiji } />
            <p>没有符合条件的航班，请更改条件后重新搜索</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}

const Airdate = ({ date, calenderdata, handleTime }) => {
  const timesplit = date.split('-')
  const preDate = new Date()
  const y = preDate.getFullYear()
  const m = preDate.getMonth()
  const nextDate = new Date(y, m + 3, 0)
  const nowDate = new Date(timesplit[0], timesplit[1] - 1, timesplit[2])
  const nowShow = `${ timesplit[1] }月${ timesplit[2] }日  周${ ['日', '一', '二', '三', '四', '五', '六'][nowDate.getDay()] }`
  let index = ''
  for (let i = 0; i < calenderdata.length; i++) {
    const c = calenderdata[i].date.split('-')
    const tempDate = new Date(c[0], c[1] - 1, c[2])
    if (tempDate.toLocaleDateString() === nowDate.toLocaleDateString()) {
      index = i
    }
  }
  console.log('选择', nowDate.toLocaleDateString())
  console.log('选择日期', nowDate.getDay())
  console.log(nowShow)
  return (
    <div className='airdate'>
      <div className='pre_date'>
        <Icon type={ require('svg/jipiao/arrowleftd.svg') } />
        <div onClick={ () => { if (preDate.toLocaleDateString() !== nowDate.toLocaleDateString()) { handleTime(`${ timesplit[0] }-${ timesplit[1] }-${ (timesplit[2] * 1) - 1 }`) } } }>
          <p style={ (preDate.toLocaleDateString() === nowDate.toLocaleDateString()) ? { color: '#999999' } : {} }>前一天</p>
          { (index > 0) ? <p>{ `¥${ calenderdata[index - 1].sellPrice }` }</p> : '' }
        </div>
      </div>
      <div className='now_date' onClick={
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
      >{ `${ nowShow } ${ (typeof index === 'number') ? `¥${ calenderdata[index].sellPrice }` : '' }` }<Icon type={ require('svg/jipiao/arrowdown.svg') } /></div>
      <div className='next_date'>
        <div onClick={ () => { if (nowDate.toLocaleDateString() !== nextDate.toLocaleDateString()) { handleTime(`${ timesplit[0] }-${ timesplit[1] }-${ (timesplit[2] * 1) + 1 }`) } } }>
          <p style={ (nowDate.toLocaleDateString() === nextDate.toLocaleDateString()) ? { color: '#999999' } : {} }>后一天</p>
          { (index < (calenderdata.length - 1) && (nowDate.toLocaleDateString() !== nextDate.toLocaleDateString())) ? <p>{ `¥${ calenderdata[index + 1].sellPrice }` }</p> : '' }
        </div>
        <Icon type={ require('svg/jipiao/arrowrightd.svg') } />
      </div>
    </div>
  )
}

// 日历取消组件
const Selecttime = props => {
  const { handleContainerClose, handleTime, calenderdata } = props
  return (
    <Calendar pricearr={ calenderdata || [] } onChange={ res => { handleContainerClose(); handleTime(res.date) } } />
  )
}

// 航班列表组件
const Airlist = ({ data, goDetail }) => {
  const { isShare, stop, dptTime, arrTime, dptAirport, dptTerminal, arrAirport, arrTerminal, airlineName, flightNum, flightTimes, flightTypeFullName, barePrice } = data
  return (
    <div className='airlist' onClick={ () => { goDetail(flightNum, flightTimes, flightTypeFullName) } }>
      <div className='airinfo'>
        <h3><span>{ dptTime }</span><span>{ stop ? '停' : ''}</span><span>{ arrTime }</span></h3>
        <p><span>{ dptAirport }{ dptTerminal }</span><span>{ arrAirport }{ arrTerminal }</span></p>
        <p>{ airlineName }{ flightNum } { flightTypeFullName }{ isShare && <span style={{ marginLeft: '0.2rem', color: '#ffab00' }}>共享</span> }</p>
      </div>
      <div className='price'><p>¥{ barePrice }</p></div>
    </div>
  )
}

// 筛选组件
class Filter extends Component {
  constructor(props) {
    super(props)
    const { defineAirdata, filiterObj } = props
    this.state = {
      defineAirdata,
      filiterObj: JSON.parse(JSON.stringify(filiterObj)),
    }
  }
  handleChangeTime(i, dptTime) {
    const { filiterObj } = this.state
    dptTime[i].choose = !dptTime[i].choose
    filiterObj.dptTime = dptTime
    this.setState({ filiterObj })
  }
  handleChangeAirline(i, airline) {
    const { filiterObj } = this.state
    airline[i].choose = !airline[i].choose
    filiterObj.airline = airline
    this.setState({ filiterObj })
  }
  handleChangeFromArr(i, fromArr) {
    const { filiterObj } = this.state
    fromArr[i].choose = !fromArr[i].choose
    filiterObj.fromArr = fromArr
    this.setState({ filiterObj })
  }
  handleChangeToArr(i, toArr) {
    const { filiterObj } = this.state
    toArr[i].choose = !toArr[i].choose
    filiterObj.toArr = toArr
    this.setState({ filiterObj })
  }
  handleClear() {
    const { defiliterObj } = this.props
    const filiterObj = JSON.parse(JSON.stringify(defiliterObj))
    this.setState({ filiterObj })
  }
  handleFilter() {
    const { defiliterObj, defineAirdata, handleFilterback, onClose, timeSort, priceSort } = this.props
    const Pairline = defiliterObj.airline
    const PdptTime = defiliterObj.dptTime
    const PfromArr = defiliterObj.fromArr
    const PtoArr = defiliterObj.toArr
    const { filiterObj } = this.state
    const { airline, dptTime, fromArr, toArr } = filiterObj
    const arr = defineAirdata.filter(e => {
      let bool1 = false
      let bool2 = false
      let bool3 = false
      let bool4 = false
      if (JSON.stringify(PdptTime) !== JSON.stringify(dptTime)) {
        for (let i = 0; i < dptTime.length; i++) {
          const timearr = dptTime[i].name.split('-')
          const pro = parseInt(timearr[0].replace(':', ''), 10)
          const next = parseInt(timearr[1].replace(':', ''), 10)
          const startime = parseInt(e.dptTime.replace(':', ''), 10)
          if (startime > pro && startime < next && dptTime[i].choose) {
            bool1 = true
          }
        }
      } else {
        bool1 = true
      }
      if (JSON.stringify(Pairline) !== JSON.stringify(airline)) {
        for (let i = 0; i < airline.length; i++) {
          if (e.airlineName === airline[i].name && airline[i].choose) {
            bool2 = true
          }
        }
      } else {
        bool2 = true
      }
      if (JSON.stringify(PfromArr) !== JSON.stringify(fromArr)) {
        for (let i = 0; i < fromArr.length; i++) {
          if (e.dptAirport === fromArr[i].name && fromArr[i].choose) {
            bool3 = true
          }
        }
      } else {
        bool3 = true
      }
      if (JSON.stringify(PtoArr) !== JSON.stringify(toArr)) {
        for (let i = 0; i < toArr.length; i++) {
          if (e.arrAirport === toArr[i].name && toArr[i].choose) {
            bool4 = true
          }
        }
      } else {
        bool4 = true
      }
      return bool1 && bool2 && bool3 && bool4
    })
    if (arr.length !== defineAirdata.length) {
      onClose()
      handleFilterback({
        airdata: this.sortAirdata(timeSort, priceSort, arr),
        filiterObj,
      })
    } else if (JSON.stringify(defiliterObj) === JSON.stringify(filiterObj)) {
      onClose()
      handleFilterback({
        airdata:    this.sortAirdata(timeSort, priceSort, defineAirdata),
        filiterObj: defiliterObj,
      })
    } else {
      let filting = false
      keys(filiterObj).forEach(o => {
        filiterObj[o].forEach(oo => {
          if (oo.choose) filting = true
        })
      })
      if (filting) {
        handleFilterback({
          airdata: this.sortAirdata(timeSort, priceSort, arr),
          filiterObj,
        })
      }
      onClose()
      console.log('未选择筛选条件或筛选条件未改变')
    }
  }

  sortAirdata(timeSort, priceSort, airdata) {
    if (typeof timeSort === 'boolean') {
      if (timeSort) {
        for (let i = 0; i < airdata.length; i++) {
          for (let j = 0; j < airdata.length - 1 - i; j++) {
            const pro = parseInt(airdata[j].dptTime.replace(':', ''), 10)
            const next = parseInt(airdata[j + 1].dptTime.replace(':', ''), 10)
            if (pro > next) {
              const temp = airdata[j + 1]
              airdata[j + 1] = airdata[j]
              airdata[j] = temp
            }
          }
        }
      } else {
        for (let i = 0; i < airdata.length; i++) {
          for (let j = 0; j < airdata.length - 1 - i; j++) {
            const pro = parseInt(airdata[j].dptTime.replace(':', ''), 10)
            const next = parseInt(airdata[j + 1].dptTime.replace(':', ''), 10)
            if (pro < next) {
              const temp = airdata[j + 1]
              airdata[j + 1] = airdata[j]
              airdata[j] = temp
            }
          }
        }
      }
    } else if (typeof priceSort === 'boolean') {
      if (priceSort) {
        for (let i = 0; i < airdata.length; i++) {
          for (let j = 0; j < airdata.length - 1 - i; j++) {
            if (airdata[j].barePrice > airdata[j + 1].barePrice) {
              const temp = airdata[j + 1]
              airdata[j + 1] = airdata[j]
              airdata[j] = temp
            }
          }
        }
      } else {
        for (let i = 0; i < airdata.length; i++) {
          for (let j = 0; j < airdata.length - 1 - i; j++) {
            if (airdata[j].barePrice < airdata[j + 1].barePrice) {
              const temp = airdata[j + 1]
              airdata[j + 1] = airdata[j]
              airdata[j] = temp
            }
          }
        }
      }
    }
    return airdata
  }
  render() {
    const { filiterObj } = this.state
    const { airline, dptTime, fromArr, toArr } = filiterObj
    const { onClose } = this.props
    return (
      <div className='filterWrap'>
        <h3><span onClick={ () => { onClose() } }>取消</span><span onClick={ () => { this.handleClear() } }><Icon type={ require('svg/jipiao/deletef.svg') } />清空已选</span><span onClick={ () => { this.handleFilter() } }>确定</span></h3>
        <div className='chooseWarp'>

          <h4>起飞时间</h4>
          {
            dptTime.map((e, i) => <p className={ e.choose && 'choose' } onClick={ () => { this.handleChangeTime(i, dptTime) } } key={ e.name }><span><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span>{ e.name }</p>)
          }
          <h4>航空公司</h4>
          {
            airline.map((e, i) => <p className={ e.choose && 'choose' } onClick={ () => { this.handleChangeAirline(i, airline) } } key={ e.name }><span><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span>{ e.name }</p>)
          }
          <h4>起飞机场</h4>
          {
            fromArr.map((e, i) => <p className={ e.choose && 'choose' } onClick={ () => { this.handleChangeFromArr(i, fromArr) } } key={ e.name }><span><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span>{ e.name }</p>)
          }
          <h4>降落机场</h4>
          {
            toArr.map((e, i) => <p className={ e.choose && 'choose' } onClick={ () => { this.handleChangeToArr(i, toArr) } } key={ e.name }><span><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span>{ e.name }</p>)
          }
        </div>
      </div>
    )
  }
}

export default Air
