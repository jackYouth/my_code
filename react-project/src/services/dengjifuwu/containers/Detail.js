import { connect }            from 'react-redux'
import { wrap }               from '@boluome/oto_saas_web_app_component'
import { getStore }           from '@boluome/common-lib'
import { handleChooseTimes, returnThisData }  from '../actions/Detail'
import Detail                 from '../components/Detail'

const mapStateToProps = ({ app, detail }) => ({ ...app, ...detail })

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleChooseTimes: chooseTimes => dispatch(handleChooseTimes(chooseTimes)),
})

const mapFunToComponent = (dispatch, state) => ({
  componentWillMount: () => {
    console.log('state', state)
    if (!state.thisData) {
      const thisDatas = getStore('thisData', 'session')
      console.log('123', thisDatas)
      dispatch(returnThisData(thisDatas))
    }
    // document.title = '详情'
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Detail)
)
