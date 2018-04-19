import React from "react"
import {connect} from  "react-redux"
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Order from "../components/Order.js"
import { setServerUrl, setStore, getStore } from "@boluome/common-lib"
import { Loading, Mask, wrap } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile';
import { get, send, afterOrdering } from 'business'


import { orderReset, addReset } from "../actions/order.js"

const mapStateToProps = (state, props) => {
    const { order } = state
    return {
    ...order
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,
    goAddflate:(peccalist,orderConfig) => {
      peccalist = JSON.parse(JSON.stringify(peccalist));
      console.log(peccalist);
      let customerUserId = getStore('customerUserId', 'session');
      get(`/weizhang/v1/${customerUserId}/${peccalist.plateNumber}/detail`, { 'userId': customerUserId, 'plateNumber': peccalist.plateNumber }).then(({ code, data, message} ) => {
        if(code===0){
          peccalist.plateNumber = peccalist.plateNumber.split('')
          // if(data[0].CheliangZhengShu){
          //   data[0].CheliangZhengShu = [{url:data[0].CheliangZhengShu}]
          // }else{
          //   data[0].CheliangZhengShu =[]
          // }
          // if(data[0].DriverUrl){
          //   data[0].DriverUrl = [{url:data[0].DriverUrl}]
          // }else{
          //   data[0].DriverUrl =[]
          // }
          // if(data[0].DriverSecondUrl){
          //   data[0].DriverSecondUrl = [{url:data[0].DriverSecondUrl}]
          // }else{
          //   data[0].DriverSecondUrl =[]
          // }
          const addData = {
            ...data[0],
            ...peccalist,
            orderConfig,
            readOnly:true
          }
          setStore('addData', addData, 'session')
          browserHistory.push(`/weizhang/addFlate`);
        }else {
          console.log(message);
        }
      })
    },
    handlePromotionChange:(data)=>{
      dispatch(orderReset({
        curDiscountData:data
      }))
    },
    handleSubmit: (orderConfig,peccalist,curDiscountData) => {
        let handleClose = Loading();
        let orderCodes = [];
        let uniqueCodes = [];
        let violations = peccalist.peccancyList.violations;
        violations.forEach((o,i)=>{
          if(o.canSelect == o.selected && o.canSelect== true){
            orderCodes.push(o.orderCode);
            uniqueCodes.push(o.uniqueCode);
          }
        })
        let couponId=curDiscountData.coupon?curDiscountData.coupon.id:'';
        let activityId=curDiscountData.activity?curDiscountData.activity.id:'';
        const { OTO_SAAS = {} } = window
        const { customer = {} } = OTO_SAAS
        const { noCustomerUserPhone = false } = customer
        let phone = ''
        if (noCustomerUserPhone) {
          phone = peccalist.carPhone
        } else {
          phone = getStore('userPhone', 'session')
        }
        send('/weizhang/v1/order',{'channel':'chexingyi',
                                  'cityId':peccalist.cityId,
                                  'plateNumber':peccalist.plateNumber,
                                  'vin':peccalist.vin,
                                  'engineNo':peccalist.engineNo,
                                  'orderCodes':orderCodes,
                                  'uniqueCodes':uniqueCodes,
                                  'orderConfig':orderConfig,
                                  'couponId':couponId,
                                  'activityId':activityId,
                                  phone,
                                  'userId': getStore('customerUserId', 'session')})
            .then(({ code, data, message} ) => {
              if(code===0){
                handleClose();
                // window.location.href = "/cashier/" + data.id
                afterOrdering(data)
              }else {
                handleClose();
                Toast.info(message, 1);
              }
            })
    },
  }
}

const mapfuncToComponent = (dispatch, state) => {
  return {
    componentWillMount : () => {
      const orderData = getStore('orderData', 'session')
      dispatch(orderReset({
        ...orderData
      }))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapfuncToComponent)(Order))
