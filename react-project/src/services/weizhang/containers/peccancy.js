import React from "react"
import {connect} from  "react-redux"
import Peccancy from "../components/Peccancy.js"
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { setServerUrl, setStore, getStore } from "@boluome/common-lib"
import { Loading, wrap } from '@boluome/oto_saas_web_app_component'

import { pecReset, conReset, orderReset } from "../actions/peccancy.js"
import { Toast, Modal } from 'antd-mobile';
import { get, send } from 'business'

const alert = Modal.alert;

const showAlert = (dispatch,peccalist,condiData,data) => {
  alert('温馨提示', '根据交管部门在线办理要求，您需要补充本车相关信息才能办理', [
    { text: '放弃办理', onPress: () => { console.log('cancel') }, style: 'default' },
    { text: '补充信息', onPress: () => {
      const conData = {
        peccalist,condiData,data
      }
      setStore('conData', conData, 'session')
      browserHistory.push(`/weizhang/condition`)
    } },
  ]);
};

const showMsg = (msg) => {
  alert('温馨提示', msg , [
    { text: '确定', onPress: () => console.log('cancel'), style: 'default' },
  ]);
};

const mapStateToProps = (state, props) => {
  const { peccancy } = state
  return {
    ...peccancy
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,
    handleChangesel: (quanxuan, value, peccancyList) => {
      let bool = true;
      value.selected = !value.selected
      peccancyList.violations = peccancyList.violations.map(item => {
        if(item.canSelect == true && item.selected == false ){
          bool = false;
        }
        if(item.uniqueCode === value.uniqueCode) {
          return value
        } else {
          return item
        }
      })
      dispatch(pecReset({peccancyList}));
      quanxuan = bool;
      dispatch(pecReset({quanxuan}))
    },
    handleMsg: (e, msg) => {
      e.stopPropagation()
      Toast.info(msg, 0,()=>{},true)
      document.getElementsByClassName('am-toast')[0].addEventListener('click',() => { Toast.hide() },true)
    },
    handleQuanxuan:(quanxuan, peccancyList)=>{
      quanxuan = !quanxuan;
      peccancyList.violations = peccancyList.violations.map(item => {
        if(item.canSelect == true && quanxuan == true){
          item.selected=true;
        }else if(item.canSelect == true && quanxuan == false){
          item.selected=false;
        }
        return item;
      })
      dispatch(pecReset({peccancyList}))
      dispatch(pecReset({quanxuan}))
    },
    handleSubmit: (prop) => {
      const {cityId,cityName,engineNo,peccancyList,plateNumber,vin,id,carPhone} = prop;
      let peccalist = {cityId,cityName,engineNo,peccancyList,plateNumber,vin,id, carPhone};
      let orderCodes = [];
      let uniqueCodes = [];
      let violations = prop.peccancyList.violations;
      violations.forEach((o,i)=>{
        if(o.canSelect == o.selected && o.canSelect== true){
          orderCodes.push(o.orderCode);
          uniqueCodes.push(o.uniqueCode);
        }
      })
      console.log(orderCodes);
      if(orderCodes.length){
        let handleClose = Loading()
        get('/weizhang/v1/order/condition',{'channel':'chexingyi',
                                            'plateNumber':prop.plateNumber,
                                            'orderCode':orderCodes.join('|'),
                                            'userId': getStore('customerUserId', 'session')})
            .then(({ code, data, message} ) => {
              handleClose()
              if(code===0){
                let bool = false;
                let condiData ={};
                for(let i in data){
                  if(data[i] == 99){
                    condiData[i] = '';
                    bool = true;
                  }
                }
                if(bool){
                  console.log(condiData);
                  showAlert(dispatch,peccalist,condiData,data);
                }else{
                  let orderConfig = data;
                  const orderData = {
                    peccalist,orderConfig
                  }
                  setStore('orderData', orderData, 'session')
                  browserHistory.push(`/weizhang/order`)
                }

              }else {
                console.log(message);
              }
            })
      }else{
          Toast.info('请选择代缴违章', 1);
      }


    }
  }
}

const mapfuncToComponent = (dispatch, state) => {
  return {
    componentWillMount : () => {
      const getData = () => {
        const dataAll = getStore('dataAll', 'session')
        let {cityId, cityName, plateNumber, vin, engineNo, id} = dataAll;
        let handleClose = Loading()
        const { OTO_SAAS = {} } = window
        const { customer = {} } = OTO_SAAS
        const { noCustomerUserPhone = false } = customer
        let phone = ''
        if (noCustomerUserPhone) {
          phone = dataAll.carPhone
        } else {
          phone = getStore('userPhone', 'session')
        }
        get('/weizhang/v1/query',{'channel':'chexingyi',
                                  'id':id,
                                  'cityId':cityId,
                                  'plateNumber':plateNumber,
                                  'vin':vin,
                                  'engineNo':engineNo,
                                  phone,
                                  'userId': getStore('customerUserId', 'session')})
          .then(({ code, data, message} ) => {
            handleClose()
            if(code===0){
              let quanxuan=false;
              let noQuanxuan=false;
                if(data.violations){
                  data.violations = data.violations.map(item => {
                      if(item.canSelect){
                        item.selected=true;
                        quanxuan=true;
                        noQuanxuan=true;
                      }else{
                        item.selected=false;
                      }
                      return item;
                  })
                }

                dispatch(pecReset({
                  peccancyList:data,
                  id:id,
                  cityId:cityId,
                  cityName:cityName,
                  plateNumber:plateNumber,
                  vin:vin,
                  engineNo:engineNo,
                  carPhone:dataAll.carPhone,
                  quanxuan,
                  noQuanxuan
                }))
            }else {
              showMsg(message);
              console.log(message);
            }
          })
        }
        if (getStore('pecBool', 'session')) {
          const pecData = getStore('pecData', 'session')
          dispatch(pecReset({ ...pecData }))
        } else {
          getData()
        }

    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapfuncToComponent)(Peccancy))
