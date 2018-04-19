import { connect } from 'react-redux'
import { get } from '@boluome/common-lib';
import { dyChange , floorChange , sumFloorChange , areaChange , ndChange , chooseCx , buildingChange } from '../actions'
import { showCity } from '../actions/showCity'
import { confirmBuilding } from '../actions/chooseBuilde'
import { chooseCity } from '../actions/chooseCity'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { getLocation } from 'business'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { browserHistory } from 'react-router'
import app from '../components/app'

// export const customerCode = location.host.replace(/(.test.otosaas.com|.otosaas.com)/, '')

const mapStateToProps = (state) => {

  // console.log('state-------------',state);

  const { inputChange , confirmBuilding , confirmDistrict , cities , ndChange , showCity } = state

  return {
    ...inputChange,
    ...confirmBuilding,
    ...confirmDistrict,
    ...cities,
    ...ndChange,
    ...showCity
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    dyChange: val => dispatch(dyChange(val)),
    floorChange: val => dispatch(floorChange(val)),
    sumFloorChange: val => dispatch(sumFloorChange(val)),
    areaChange: val => dispatch(areaChange(val)),
    ndChange: val => dispatch(ndChange(val)),
    chooseCx: (i , index) => dispatch(chooseCx(i , index)),
    feachDistrict: data => dispatch(feachDistrict(data)),
    comparison: (floor, sumFloor) => {
      if(floor && sumFloor){
        if( Number(floor) > Number(sumFloor) ){
          Toast.info('楼层不可大于总层数')
          return false
        } else {
          return true
        }
      }
    },
    // clickEvaluation: (inforArr,comparison) => {
    //   // let inforArr = [showCities, residentialareaName , building , dyVal , floor , sumFloor , cx , area , year ];
    //   console.log('inforArr---------',inforArr);
    //   let cnArr = ['所在城市','小区名称', '楼号' ,'单元','居住楼层','总层数','朝向','建筑面积','建筑年代']
    //   inforArr.forEach((item,index) => {
    //     if(!item){
    //       Toast.info(cnArr[index] + '不能为空' , 1)
    //       return false
    //     }
    //   })
    //   for (var i = 0; i < inforArr.length; i++) {
    //     if(!inforArr[i]){
    //       Toast.info(cnArr[i] + '不能为空' , 1)
    //       return false
    //     }
    //   }
    //   if(comparison(floor, sumFloor)){
    //     browserHistory.push('/fanggu/result')
    //   }
    // },
    confirmDistrict: (address,residentialareaName) => dispatch(confirmDistrict(address,residentialareaName)),
    chooseCity: result => dispatch(chooseCity(result)),
    buildingChange: val => dispatch(buildingChange(val))
  }
}

const mapFuncToComponent = (dispatch, state) => {
  return {
    componentWillMount: () => {
      // getCustomerConfig(customerCode, () => {
        const handleClose = Loading()
        getLocation(() => {dispatch(showCity());handleClose()})
      // });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFuncToComponent)(app))
