import { connect } from 'react-redux'
import { getStore, setStore } from '@boluome/common-lib'
import { wrap, Loading }    from '@boluome/oto_saas_web_app_component'
import City from '../components/city'

const mapStateToProps = ({ app }) => {
  const LocationAddr = getStore('huoche_LocationAddr', 'session') ? getStore('huoche_LocationAddr', 'session') : '上海'
  const chooseCity = getStore('huoche_ChooseCity', 'session') ? getStore('huoche_ChooseCity', 'session') : { from: '上海', to: '北京' }
  const mark = window.location.search
  return {
    LocationAddr,
    chooseCity,
    mark,
    ...app,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handlePoint(result, chooseCity, mark) {
      console.log('result3333', result, 'mark---', mark)
      const { name } = result
      if (mark === '?Start') {
        const { to } = chooseCity
        dispatch({ type: 'CHOOSE_CITY', chooseCity: { from: name, to } })
        console.log('result', result)
        setStore('huoche_ChooseCity', { from: name, to }, 'session')
      } else if (mark === '?End') {
        const { from } = chooseCity
        dispatch({ type: 'CHOOSE_CITY', chooseCity: { from, to: name } })
        setStore('huoche_ChooseCity', { from, to: name }, 'session')
      }
      console.log('chooseCity--3--', chooseCity, result)
    },
  }
}

const handleClose = Loading()
const mapFunToComponent  = () => ({
  componentWillMount: () => {
    // console.log('city.js')
  },
  componentDidMount() {
    handleClose()
  },
  componentWillUnmount() {
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(City)
)
