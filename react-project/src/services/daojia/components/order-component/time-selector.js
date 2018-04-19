import React, { Component } from 'react'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'
import { Tabs, Toast } from 'antd-mobile'

import '../../styles/time-select.scss'

const TabPane = Tabs.TabPane

export default class TimeSelector extends Component {
  constructor(props) {
    super(props)
    const { currentTime = '', currentDate = '' } = this.props
    this.state = {
      timesData: '',
      currentTime,
      currentDate,
    }
    this.getTimes = this.getTimes.bind(this)
    this.getTimes()
  }
  getTimes() {
    const closeLoading = Loading()
    const { serviceId } = this.props
    get('/daojia/v1/process/service/time', { serviceId }).then(({ code, data, message }) => {
      if (code === 0) {
        this.setState({ timesData: data })
      } else {
        Toast.fail(message, 1)
      }
      closeLoading()
    })
  }
  handleTabClick(currentDate) {
    this.setState({ currentDate, currentTime: '' })
  }
  handleTimeClick(currentDate, currentTime, serviceCount) {
    const { handleSelectTime, handleContainerClose } = this.props
    this.setState({ currentTime })
    handleSelectTime(currentDate, currentTime, serviceCount)
    handleContainerClose()
  }
  render() {
    const { timesData, currentTime } = this.state
    let { currentDate } = this.state
    if (!timesData) return <div />
    const { workTimeType, dateVoList } = timesData
    if (!currentDate) currentDate = dateVoList[0].shortDate
    return (
      <div className='time-select'>
        <Tabs defaultActiveKey={ currentDate } pageSize={ 5 } onTabClick={ ii => this.handleTabClick(ii) }>
          {
            dateVoList.map(data => {
              const { date, shortDate, tag, timePointVos = [] } = data
              const newTimePointVos = JSON.parse(JSON.stringify(timePointVos))
              // 长度不为1时，把第一个不限时间删掉，为1时，就将第一个展示出来
              if (newTimePointVos.length !== 1) newTimePointVos.shift()
              const ttt = newTimePointVos.map(item => {
                const { timePoint, serviceTag, serviceCount } = item
                const active = currentTime === timePoint
                let className = 'point'
                if (workTimeType === 1) className = 'section'
                if (serviceTag) className += ' disable'
                return (
                  <li style={ active ? { color: '#ffab00', borderColor: '#ffab00' } : {} } onClick={ !serviceTag ? () => this.handleTimeClick(currentDate, timePoint, serviceCount) : '' } key={ item.timePoint } className={ className }>
                    { timePoint }
                    {
                      serviceTag &&
                      <span>{ serviceTag }</span>
                    }
                  </li>
                )
              })
              return (
                <TabPane
                  tab={
                    <div className={ tag ? 'tab-name disable' : 'tab-name' }>
                      <h1>
                        { date }
                        {
                          tag &&
                          <span>{ tag }</span>
                        }
                      </h1>
                      <p>{ shortDate }</p>
                    </div>
                  }
                  key={ shortDate }
                >
                  <ul className='tab-content'>
                    {
                      newTimePointVos &&
                      ttt
                    }
                  </ul>
                </TabPane>
              )
            })
          }
        </Tabs>
      </div>
    )
  }
}
