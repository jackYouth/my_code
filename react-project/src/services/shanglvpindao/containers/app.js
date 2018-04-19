import { connect } from 'react-redux'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { getLocationGaode, login, get } from 'business'
import { getStore, setStore } from '@boluome/common-lib'
import { handleCurrCity, fetchHotels, fetchScenics } from '../actions'
import App from '../components/app'
import jiudianImg from '../image/jiudian.png'
import huocheImg from '../image/huoche.png'
import jipiaoImg from '../image/jipiao.png'
import menpiaoImg from '../image/menpiao.png'

const mapStateToProps = ({ app }) => ({ ...app })

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleSuccess: (selectedAddress, currentCityId) => {
    console.log('selectedAddress=========>', selectedAddress)
    get(`/jiudian/v1/cities/${ selectedAddress.city }/id`, { channel: 'ctrip', name: selectedAddress.city })
    .then(({ code, data = '', message }) => {
      if (code === 0) {
        console.log('ewjoifojfeaojfewjoi-=-=-==-=--=->', data)
        const { city = '', prov = '' } = selectedAddress
        const selectedPoint = {
          latitude : selectedAddress.location.lat,
          longitude: selectedAddress.location.lng,
        }
        const postData = {
          channel: 'ctrip',
          CityId: !data ? currentCityId : data,
          DistanceType: 0,
          PageIndex: 1,
          PageSize: 10,
          offset: 0,
          lat: selectedPoint.latitude,
          lng: selectedPoint.longitude,
          mapType: 'gaode',
          StarRate: '4,5',
        }
        const datas = {
          prov,
          city,
          channel: 'lvmama',
          currentPage: 1,
          lat: selectedPoint.latitude,
          lng: selectedPoint.longitude,
          mapType: 'gaode',
          pageSize: 4,
        }
        dispatch({ type: 'SELECTED_ADDRESS', selectedAddress, selectedPoint })
        dispatch(fetchHotels(postData))
        dispatch(fetchScenics(datas))
      } else {
        console.log(message)
      }
    })
  },
})

const mapFunToComponent = dispatch => ({
  componentWillMount: () => {
    const handleClose = Loading()
    const basisDo = () => {
      const entryArr = [
        {
          name: '酒店',
          img: jiudianImg,
          // url: 'https://dev-me.otosaas.com/jiudian/?customerUserId=test_long&customerUserPhone=15214387211',
          url: `${ location.protocol }//${ location.host }/jiudian`,
        },
        {
          name: '火车票',
          img: huocheImg,
          // url: 'https://dev-me.otosaas.com/huoche/?customerUserId=test_long&customerUserPhone=15214387211',
          url: `${ location.protocol }//${ location.host }/huoche`,
        },
        {
          name: '机票',
          img: jipiaoImg,
          // url: 'https://dev-me.otosaas.com/jipiao/?customerUserId=test_long&customerUserPhone=15214387211',
          url: `${ location.protocol }//${ location.host }/jipiao`,
        },
        {
          name: '景点',
          img: menpiaoImg,
          // url: 'https://dev-me.otosaas.com/menpiao/?customerUserId=test_long&customerUserPhone=15214387211',
          url: `${ location.protocol }//${ location.host }/menpiao`,
        },
      ]
      const { city } = getStore('currentPosition', 'session')
      dispatch({ type: 'ENTRY_ARR', entryArr })
      dispatch(handleCurrCity(city))
      handleClose()
    }
    login(err => {
      if (err) {
        console.log('login err', err)
      } else {
        getLocationGaode(error => {
          if (error) {
            console.log('getLocationGaode err', error)
            setStore('geopoint', '{ latitude: 31.24169, longitude: 121.49491 }', 'session')
            setStore('currentPosition', { city: '上海市' }, 'session')
            setStore('currentAddress', '东方明珠', 'session')
            basisDo()
          } else {
            basisDo()
          }
        })
      }
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
