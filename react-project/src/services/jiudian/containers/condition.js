import { connect }            from 'react-redux'
import { wrap }               from '@boluome/oto_saas_web_app_component'
import { getStore }           from '@boluome/common-lib'
import { handleFilterConditions, handleZones, handleShowContent, chooseFilterCondition } from '../actions/condition'
import Condition              from '../components/condition'


const mapStateToProps = ({ app, condition }) => ({ ...app, ...condition })

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleShowContent:     showIndex => dispatch(handleShowContent(showIndex)),
  chooseFilterCondition: chooseConditions => dispatch(chooseFilterCondition(chooseConditions)),
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    dispatch({ type: 'CHANGE_OFFSET', offset: 0, isFromDetail: false })
    const { currentCityId = getStore('currentCityId'), chooseCity = {} } = state
    const channel = getStore('channel')
    const { id } = chooseCity
    if (!id) {
      dispatch(handleZones(channel, currentCityId))
      dispatch(handleFilterConditions(channel, currentCityId))
    } else {
      dispatch(handleZones(channel, id))
      dispatch(handleFilterConditions(channel, id))
    }
  },
  componentWillUnmount: () => {
    dispatch({ type: 'FILTER_ZONES', filterZones: [], filterConditions: [] })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Condition)
)
