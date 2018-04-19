import { connect } from 'react-redux'
import { setStore, getStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { forceCheck } from 'react-lazyload'
import YearActivity         from '../../components/activity/year-activity'

import { getActivities } from '../../actions/activity/year-activity'

const mapStateToProps = ({ yearActivity }) => {
  return {
    ...yearActivity,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleTitleClick(currentActivityIndex) {
      document.querySelector('.year-activity').scrollTop = document.querySelectorAll('.year-activity-item')[currentActivityIndex].offsetTop - document.querySelector('.sub-title').offsetHeight
    },
    handleScroll(e) {
      const { scrollTop } = e.target
      if (scrollTop) {
        if (scrollTop >= (document.querySelector('.banner').offsetHeight - document.querySelector('.sub-titles').offsetHeight)) {
          // 获取当前subTitle的索引
          let currentActivityIndex = 0
          // document.querySelectorAll('.sub-title').forEach((o, i) => {
          //   if (scrollTop > o.offsetTop - (50 * window.devicePixelRatio)) currentActivityIndex = i
          // })
          // 安卓机加上lazyload后使用forEach操作dom报错，该用for循环
          const nodes = document.querySelectorAll('.sub-title')
          for (let i = 0; i < nodes.length; i++) {
            if (scrollTop > nodes[i].offsetTop - (50 * window.devicePixelRatio)) currentActivityIndex = i
          }
          dispatch({ type: 'SET_CURRENT_ACTIVITITY_INDEX', currentActivityIndex })
          // 自动显示在第一个
          document.querySelector('.sub-titles').scrollLeft = document.querySelector('.sub-titles li:nth-of-type(1)').offsetWidth * (currentActivityIndex - 1)
          // 设置显示subTitles条目
          dispatch({ type: 'SHOW_SUB_TITLES', showSubTitles: true })
        } else {
          dispatch({ type: 'SHOW_SUB_TITLES', showSubTitles: false })
        }
      }
      forceCheck()
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    dispatch(getActivities())
  },
  componentDidMount() {
    const yearEndScrollTop = getStore('yearEndScrollTop', 'session')
    console.log('yearEndScrollTop', yearEndScrollTop, document.querySelector('.year-activity'))
    if (yearEndScrollTop && document.querySelector('.year-activity')) document.querySelector('.year-activity').scrollTop = yearEndScrollTop
  },
  componentWillUnmount() {
    const yearEndScrollTop = document.querySelector('.year-activity').scrollTop
    setStore('yearEndScrollTop', yearEndScrollTop, 'session')
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(YearActivity)
)
