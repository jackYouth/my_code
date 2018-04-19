import React, { Component } from 'react'
import { getStore, setStore, removeStore } from '@boluome/common-lib'
import { Calendar, Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import moment from 'moment'
import '../style/dateChoose.scss'


class DateChoose extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: moment().format('YYYY-MM-DD'),
      endDate:   moment().add(1, 'days').subtract(8, 'hours').format('YYYY-MM-DD'),
      startTime: new Date(`${ moment().format('YYYY/MM/DD') } 00:00:00`).getTime(),
      endTime:   new Date(`${ moment().add(1, 'days').format('YYYY/MM/DD') } 00:00:00`).getTime(),
    }
  }

  handleChangeTime({ chooseEndtime, chooseStartime, end, start, number }) {
    const { onDateChange } = this.props
    // console.log(chooseEndtime, chooseStartime, end, start, number)
    // console.log(this)
    this.setState({ startTime: chooseStartime, endTime: chooseEndtime, sumNight: number, startDate: start, endDate: end })
    const dateInfo = {
      startDate: start,
      endDate:   end,
      startTime: chooseStartime,
      endTime:   chooseEndtime,
      sumNight:  number,
    }
    setStore('dateInfo', dateInfo)
    if (onDateChange) {
      onDateChange(dateInfo)
    }
    // setTimeout(() => { Mask.closeAll() }, 300)
    history.go(-1)
  }

  handleGetDay(val) {
    const day = new Date(val).getDay()
    let showDay
    switch (day) {
      case 1:
        showDay = '一'
        break
      case 2:
        showDay = '二'
        break
      case 3:
        showDay = '三'
        break
      case 4:
        showDay = '四'
        break
      case 5:
        showDay = '五'
        break
      case 6:
        showDay = '六'
        break
      default:
        showDay = '日'
    }
    return showDay
    // console.log('day', day)
  }

  componentWillMount() {
    const dateInfo = getStore('dateInfo')
    if (dateInfo) {
      const localDateInfo = getStore('dateInfo').startDate
      const thatDate = new Date(localDateInfo).getTime()
      const nowDate = new Date().getTime()
      console.log('localDateInfo', thatDate, nowDate - thatDate)
      if (nowDate - thatDate > 86400000) {
        console.log('存储时间已过期')
        removeStore('dateInfo')
        console.log('dateInfo', getStore('dateInfo'))
      } else {
        console.log('存储时间未过期')
      }
      if (!dateInfo.startTime || !dateInfo.endTime) {
        console.log('存储时间异常', dateInfo.startTime, dateInfo.endTime)
        removeStore('dateInfo')
      }
    }
  }

  // componentDidMount() {
  //   console.log('componentDidMount dateInfo', getStore('dateInfo'))
  // }

  render() {
    const dateInfo = getStore('dateInfo')
    if (!dateInfo) {
      setStore('dateInfo', {
        startDate: moment().format('YYYY-MM-DD'),
        endDate:   moment().add(1, 'days').subtract(8, 'hours').format('YYYY-MM-DD'),
        startTime: new Date(`${ moment().format('YYYY/MM/DD') } 00:00:00`).getTime(),
        endTime:   new Date(`${ moment().add(1, 'days').format('YYYY/MM/DD') } 00:00:00`).getTime(),
        sumNight:  1,
      })
    }
    const { startDate, endDate, startTime, endTime, sumNight = 1 } = !getStore('dateInfo') ? this.state : getStore('dateInfo')
    // console.log('1111111111---------->', getStore('dateInfo'), this.state, startTime, endTime)
    return (
      <div className='dateChoose-container' onClick={ () =>
        Mask(
          <SlidePage target='right' type='root' showClose={ false }>
            <Calendar
              pricearr={ [] }
              onChangeTime={ data => this.handleChangeTime(data) }
              CustomClick='true'
              DefaultnoUse='use'
              CustomStartime={ startTime }
              CustomEndtime={ endTime }
              untilDay={ 30 }
            />
          </SlidePage>
          , { mask: false }
        ) }
      >
        <div className='arriveDate-container date-box'>
          <span>入住</span>
          <p>{ `${ startDate.split('-')[1] }月${ startDate.split('-')[2] }日 周${ this.handleGetDay(startTime) }` }</p>
        </div>
        <span className='sumNight-container'>{ `共${ sumNight }晚` }</span>
        <div className='departureDate-container date-box'>
          <span>离店</span>
          <p>{ `${ endDate.split('-')[1] }月${ endDate.split('-')[2] }日 周${ this.handleGetDay(endTime) }` }</p>
        </div>
      </div>
    )
  }
}

export default DateChoose
