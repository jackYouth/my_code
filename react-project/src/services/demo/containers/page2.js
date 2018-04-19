import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { changePage } from '../actions'

import Page2 from '../components/page2'

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({
  dispatch,
})

const mapFunToComponent = dispatch => ({
  componentDidMount: () => {
    dispatch(changePage('占位页的Title'))
  },
  componentWillUnmount: () => {
    console.log('page2 unmount')
    dispatch(changePage('首页的Title'))
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Page2)
  )
