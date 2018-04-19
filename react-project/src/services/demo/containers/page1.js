import { connect } from 'react-redux'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { changePage } from '../actions'
import { asyncTest, asyncStop } from '../actions/page1'

import Page1 from '../components/page1'

const mapStateToProps = state => {
  const { page1 } = state

  return {
    ...page1,
  }
}
const handleClose = Loading()
const mapDispatchToProps = dispatch => ({
  dispatch,
  handleStart: interval => {
    dispatch(asyncTest(interval))
  },
  handleStop: () => asyncStop(),
})

const mapFunToComponent = dispatch => ({
  componentDidMount: () => {
    handleClose()
    dispatch(changePage('异步测试的Title'))
  },
  componentWillUnmount: () => {
    console.log('page1 unmount')
    dispatch(changePage('首页的Title'))
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Page1)
  )
