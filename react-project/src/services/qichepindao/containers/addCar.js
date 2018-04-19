import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import { removeStore, getStore } from '@boluome/common-lib'
// import { send } from 'business'
import { Modal } from 'antd-mobile'
import { featchCarBrands, handleChooseId, handleChooseCar } from '../actions/cartype'
import { getListData, detelePlateData } from '../actions/addCar'
import AddCar from '../components/addCar'

const mapStateToProps = ({ addCar }) => {
  // const { hotBrandList, brands } = carType
  return {
    ...addCar,
  }
}

const alert = Modal.alert

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleChooseId:  brandId => dispatch(handleChooseId(brandId)),
  handleChooseCar: result => dispatch(handleChooseCar(result)),
  handleEditCar:   () => {
    removeStore('qichepindao_edit_data', 'session')
    removeStore('qiche_chegu_chexi', 'session')
    removeStore('qiche_chegu_chexing', 'session')
    browserHistory.push('/qichepindao/editCar')
  },
  handleDetelePlate: plateNumber => {
    alert('删除', '删除后无法使用精准推荐服务，请确认删除吗?', [
      {
        text:    '取消',
        onPress: () => console.log('cancel'),
      },
      {
        text:    '确定',
        onPress: () => {
          dispatch(detelePlateData(plateNumber))
        },
        style:   { fontWeight: 'bold', color: '#ffab00' },
      },
    ])
  },
  handleEditPlate: plateNumber => {
    console.log('--plateNumber--', plateNumber)
    removeStore('qichepindao_edit_data', 'session')
    browserHistory.push(`/qichepindao/editCar/?plateNumber=${ plateNumber }`)
  },
})

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    dispatch(getListData())
    dispatch(featchCarBrands())
  },
  componentWillUnmount: () => {
    if (getStore('qiche_chegu', 'session')) {
      removeStore('qiche_chegu', 'session')
    }
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(AddCar)
  )
