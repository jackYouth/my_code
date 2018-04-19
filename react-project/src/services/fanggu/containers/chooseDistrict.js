import { connect } from 'react-redux'
import { feachDistrict , confirmDistrict } from '../actions/chooseDistrict'

import chooseDistrict from '../components/chooseDistrict'

const mapStateToProps = (state) => {

  // console.log('current state=============', state)

  const { districtList , confirmDistrict } = state

  return {
    ...districtList
  }
}
let timer
const mapDispatchToProps = dispatch => {
  return {
    // handleSplitName: (word, key) => {
    //   if(word.indexOf(key) === 0) {
    //     return [key, word.replace(key, '')]
    //   }
    // },
    feachDistrict: data => {
      clearTimeout(timer)
      timer = setTimeout(() => dispatch(feachDistrict(data)), 500)
    } ,
    confirmDistrict: (address,residentialareaName) => dispatch(confirmDistrict(address,residentialareaName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(chooseDistrict)
