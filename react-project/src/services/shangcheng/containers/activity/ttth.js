import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap }    from '@boluome/oto_saas_web_app_component'

import Ttth         from '../../components/activity/ttth'

import { getTtthData } from '../../actions/activity/ttth'

const mapStateToProps = ({ ttth }) => {
  const times = [
    { title: '今日特惠', date: 0 },
    { title: '明日预告', date: 1 },
  ]
  return {
    ...ttth,
    times,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeActivityDay(activityDay) {
      const paras = {
        date:             activityDay,
        activityPageCode: 'tiantiantehui',
      }
      dispatch(getTtthData(paras))
    },
    handletoCommodity(commodityId) {
      browserHistory.push(`/shangcheng/commodity?commodityId=${ commodityId }`)
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    // 清空数据
    dispatch({ type: 'SET_TTTH_DATA', ttthData: '', activityDay: '' })
    const paras = {
      date:             0,
      activityPageCode: 'tiantiantehui',
    }
    dispatch(getTtthData(paras))
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Ttth)
)
