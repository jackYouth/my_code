import { connect } from 'react-redux'
import { getStore, week, moment, setStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import Refund from '../components/refund'

const mapStateToProps = state => {
  const { refund, orderDetails } = state
  console.log('--state--', state)
  return {
    ...orderDetails,
    ...refund,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    const propsObj = getStore('huoche_Change_data', 'session')
    dispatch({ type: 'CHANGE_DATA', propsObj })
    const { trains } = propsObj
    const { departueDateTime, departureDate } = trains
    const time = `${ departueDateTime.split(' ')[0] }`
    const dateShow = `${ time.split('-')[1] }月${ time.split('-')[2] }日`
    const weed = week()(moment('day')(time))
    const datestr = moment('x')(time)
    console.log('---test---ssss', time, departureDate, dateShow, weed, datestr)
    const chooseTime = {
      dateShow,
      datestr,
      weed,
      date: time,
    }
    setStore('huoche_ChooseTime', chooseTime, 'session')
  },
  componentDidMount: () => {
    // handleClose()
  },
  componentWillUnmount: () => {
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Refund)
)
