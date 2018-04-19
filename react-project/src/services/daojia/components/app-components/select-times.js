import React from 'react'
import { Icon } from 'antd-mobile'

export default class SelectTimes extends React.Component {
  constructor(props) {
    super(props)
    const { currentDateIndex, currentTimeIndex } = props
    this.state = {
      currentDateIndex,
      currentTimeIndex,
    }
  }
  handleTimeClick(currentTimeIndex) {
    const { serverTimes, handleTimeItemClick, handleContainerClose } = this.props
    const { currentDateIndex } = this.state
    const date = serverTimes[currentDateIndex].shortDate
    const serviceTime = serverTimes[currentDateIndex].timePointVos[currentTimeIndex].timePoint
    handleTimeItemClick({ date, serviceTime, currentDateIndex, currentTimeIndex })
    handleContainerClose()
    this.setState({ currentTimeIndex })
  }
  handleDateClick(currentDateIndex) {
    this.setState({ currentDateIndex, currentTimeIndex: 0 })
  }
  render() {
    const { serverTimes } = this.props
    const { currentDateIndex, currentTimeIndex } = this.state
    const times = serverTimes[currentDateIndex].timePointVos
    return (
      <div className='dj-select-times'>
        <ul className='dates'>
          {
            serverTimes.map((item, index) => (
              <li className={ index === currentDateIndex ? 'active' : '' } key={ item.shortDate } onClick={ () => {
                if (index !== currentDateIndex) {
                  this.handleDateClick(index)
                }
              }
              }
              >
                { item.date }
                {
                  item.tag &&
                  <span>{ item.tag }</span>
                }
              </li>))
          }
        </ul>
        <ul className='times'>
          {
            times &&
            times.map((item, index) => (
              <li className={ index === currentTimeIndex ? 'active' : '' } key={ item.timePoint } onClick={ () => {
                this.handleTimeClick(index)
              }
              }
              >
                <p>
                  { item.timePoint }
                  {
                    item.serviceTag &&
                    <span>{ item.serviceTag }</span>
                  }
                </p>
                {
                  index === currentTimeIndex && <Icon type={ require('svg/daojia/selected.svg') } size='md' />
                }
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}
