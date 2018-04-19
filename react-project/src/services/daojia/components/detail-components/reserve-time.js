/*
  传入的参数：
    time: {
      startH: '00:00',
      endH:   '21:00'
    }
    dayArray: [
      {
        date:'2017-07-29'
        dateDesc:'周六'
        shortDate:'07-29'
        timeVoList:[]
      },
      {
        date:'2017-07-30'
        dateDesc:'周日'
        shortDate:'07-30'
        timeVoList:[{startH: '00:00', endH: '23:00'}]
      }
    ]
    handleAllTimeClick: Function
*/

import React from 'react'
import { Flex } from 'antd-mobile'
import { contains, flatten } from 'ramda'

import '../../styles/reserve-time.scss'

const FItem = Flex.Item

const getMins = (startTime, endTime) => {
  const startH = startTime.split(':')[0]
  const startM = startTime.split(':')[1]
  const endH = endTime.split(':')[0]
  const endM = endTime.split(':')[1]
  const mins = ((endH - startH) * 60) + (endM - startM)
  return mins
}

const ReserveTime = ({ time, dayArray, cutTimePoint }) => {
  const startTime = time.startTime
  const endTime = time.endTime
  const startH = Number(startTime.split(':')[0])
  // 当结束时间分钟大于0时，小时数加1，保证时间轴坐标够长
  const endH = Number(endTime.split(':')[1] > 0 ? ++endTime.split(':')[0] : endTime.split(':')[0])
  const timesLengthArr = []
  for (let i = startH; i <= endH; i++) {
    timesLengthArr.push(i)
  }
  // timeTotalIndex: 时间按返回的间隔分成的总分数
  let timeTotalIndex = Math.ceil(Number(getMins(startTime, endTime) / cutTimePoint))
  // 因为上一个时间返回的最小单位是小时，而下面的最小单位都是半小时，为了上下对应，所以timeTotalIndex不能为单数
  if (timeTotalIndex % 2 === 1) timeTotalIndex++
  return (
    <div className='reserve-time'>
      <div className='axis'>
        <p className='time-part'>时段</p>
        <Flex>
          {
            timesLengthArr.map((item, index) => {
              if (index % 2 === 0) {
                return (
                  <FItem className='long' key={ item }>
                    <p>{ item }</p>
                  </FItem>
                )
              }
              return <FItem className='short' key={ item } />
            })
          }
        </Flex>
      </div>
      <div className='reserve-time-list'>
        {
          dayArray.slice(0, 20).map((item, index) => <TimeAxisItem key={ item.date } { ...{ title: index > 2 ? item.shortDate : item.dateDesc, timeTotalIndex, timeVoList: item.timeVoList, startTime, cutTimePoint } } />)
        }
      </div>
    </div>
  )
}

export default ReserveTime

const TimeAxisItem = ({ title, timeTotalIndex, timeVoList, startTime, cutTimePoint }) => {
  const timeTotal = Array.from(new Array(timeTotalIndex)).map((o, i) => !o && ++i)
  let canServiceTimes = []
  // 将timeVoList中所有的时间段，都转化成和timeTotal这个总时间对应的索引，timeTotal表示[1, 2, 3, 4, 5， 6]这种共分成几份的意思
  if (timeVoList.length > 0) {
    const getCanservice = timeVoList.map(o => {
      const beginIndex = Number(getMins(startTime, o.startTime) / cutTimePoint) + 1
      const length = Number(getMins(o.startTime, o.endTime) / cutTimePoint)
      const times = Array.from(new Array(Math.ceil(length))).map((oo, i) => !oo && beginIndex + i)
      return times
    })
    canServiceTimes = [...flatten(getCanservice)]
  }
  return (
    <div className='time-axis-item'>
      <p className='time-part'>{ title }</p>
      <Flex>
        {
          timeTotal.map(item => {
            if (contains(item)(canServiceTimes)) {
              return <FItem className='able' key={ item } />
            }
            return <FItem className='disable' key={ item } />
          })
        }
      </Flex>
    </div>
  )
}
