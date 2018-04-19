import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import Picture from '../components/picture'
import { picReset } from '../actions/picture.js'


const mapStateToProps = state => {
  const { picture } = state
  return {
    ...picture,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

const mapFunToComponent  = dispatch => {
  return {
    componentWillMount: () => {
      const pic = getStore('maoyan_pic', 'session')
      dispatch(
        picReset({
          pic,
        })
      )
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Picture)
  )
