import React from "react"
import {connect} from  "react-redux"
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Condition, { TipImg, DetalImg } from "../components/Condition.js"
import { setServerUrl, getStore } from "@boluome/common-lib"
import { Mask, wrap } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile';
import { get, send } from 'business'


import { conReset, orderReset } from "../actions/condition.js"

const mapStateToProps = (state, props) => {
    const { condition } = state
    return {
    ...condition
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,
    handleTipImg: (imgsrc) => {
      Mask(<TipImg imgsrc={imgsrc} />)
    },
    handleDetalImg: (imgsrc) => {
      Mask(<DetalImg imgsrc={imgsrc} />)
    },
    changeState:(data,name,condiData) => {
      let temp= {[name]:data};
      Object.assign(condiData, temp);
      dispatch(conReset({
        condiData
      }))
    },

    sendYanzheng:(plateNumber) => {
      dispatch(conReset({
        yanzheng:false
      }))
      get('/weizhang/v1/SMS/VerificationCode',{'channel':'chexingyi',
                                'plateNumber':plateNumber})
          .then(({ code, data, message} ) => {
            if(code===0){
              Toast.info('验证码发送成功', 1);
            }else {
              console.log(message);
              Toast.info('验证码发送失败', 1);
              dispatch(conReset({
                yanzheng:true
              }))
            }
          })
    },
    handleSubmit: (peccalist,condiData,data) => {
      let bool = true;
      let phone =true;
      for(let i in condiData){
        if(!condiData[i]){
          bool = false;
        }else if(i == "FilePhone"){
          phone = (/^1(3|4|5|7|8)\d{9}$/.test(condiData.FilePhone))?phone:false;
        }else if(i == "carPhone"){
          phone = (/^1(3|4|5|7|8)\d{9}$/.test(condiData.carPhone))?phone:false;
        }
      }
      if(bool && phone){
        Object.assign(data, condiData);
        let orderConfig = data;
        dispatch(orderReset({
          peccalist,orderConfig
        }))
        let subData = {'id':peccalist.id,
                       'cityId':peccalist.cityId,
                       'cityName':peccalist.cityName,
                       'plateNumber':peccalist.plateNumber,
                       'vin':peccalist.vin,
                       'engineNo':peccalist.engineNo
                     }
        Object.assign(orderConfig, subData);
        send('/weizhang/v1/plate',{...orderConfig,
                                   'userId': getStore('customerUserId','session')
                                 })
          .then(({ code, data, msg} ) => {
            if(code===0){
              browserHistory.replace(`/weizhang/order`)
            }else{
              Toast.info(msg, 1);
            }
          })
      }else if(bool){
        Toast.info('手机号格式不正确', 1);
      }else if(phone){
        Toast.info('请将信息补充完整', 1);
      }else{
        Toast.info('请将信息补充完整', 1);
      }

    },
  }
}

const mapfuncToComponent = (dispatch, state) => {
  return {
    componentWillMount : () => {
      const conData = getStore('conData', 'session')
      dispatch(conReset({ ...conData }))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapfuncToComponent)(Condition))
