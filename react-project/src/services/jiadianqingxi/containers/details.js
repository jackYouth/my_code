// common
import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { browserHistory } from 'react-router'

import Details from '../components/details'

const mapStateToProps = () => {
  // console.log('state==========', state)
  // const { getDetailsData } = state
  const detailsData = getStore('detailsData1', 'session')
  return {
    detailsData,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    goBackPage: (cityId, Id) => {
      browserHistory.push(`/jiadianqingxi/order?cityId=${ cityId }&categoryId=${ Id }`)
    },
  }
}
const mapFunToComponent  = () => ({
  // componentDidMount: () => console.log('root mounted')
  // componentWillMount: data => dispatch( getDetailsData(data))
  // componentWillReceiveProps: nextProps => {
  //   const { detailsData } = nextProps
  //   dispatch({ type:        'KJIN_DETAILSHOW',  detailsData: data,})
  // },
})
export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Details)
)
