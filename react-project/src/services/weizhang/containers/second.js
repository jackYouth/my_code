import React from "react"
import {connect} from  "react-redux"
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Second from "../components/Second.js"
import { setServerUrl, setStore, getStore } from "@boluome/common-lib"
import { Mask, Loading, wrap } from '@boluome/oto_saas_web_app_component'
import { Toast, Modal } from 'antd-mobile'
import { get, send } from 'business'
import { keys } from 'ramda'

const alert = Modal.alert;

const showAlert = (msg) => {
  alert('温馨提示', msg , [
    { text: '确定', onPress: () => console.log('cancel'), style: 'default' },
  ]);
};

import { secReset, addReset, pecReset } from "../actions/second.js"

const mapStateToProps = (state, props) => {
  const { second } = state;
  return {
    ...second
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    handleGomycar: () => {
      if(getStore('customerUserId', 'session')){
        browserHistory.push(`/weizhang/mycar`)
      }else{
        Toast.info('用户未登录', 1);
      }
    },

    goPeclsst:(dataAll) => {
      setStore('pecBool', false, 'session')
      setStore('dataAll', dataAll, 'session')
      browserHistory.push(`/weizhang/peccancy`)
    },
    goAddflate:(plateNumber,dataAll) => {
      console.log(dataAll)
      let customerUserId = getStore('customerUserId', 'session');
      get(`/weizhang/v1/${customerUserId}/${plateNumber}/detail`, { 'userId': customerUserId, 'plateNumber': plateNumber }).then(({ code, data, message} ) => {
        if(code===0){
          let adddata = data[0];
          Object.assign(adddata,dataAll);
          adddata.plateNumber = adddata.plateNumber.split('')
          // if(adddata.CheliangZhengShu){
          //   adddata.CheliangZhengShu = [{url:adddata.CheliangZhengShu}]
          // }else{
          //   adddata.CheliangZhengShu =[]
          // }
          // if(adddata.DriverUrl){
          //   adddata.DriverUrl = [{url:adddata.DriverUrl}]
          // }else{
          //   adddata.DriverUrl =[]
          // }
          // if(adddata.DriverSecondUrl){
          //   adddata.DriverSecondUrl = [{url:adddata.DriverSecondUrl}]
          // }else{
          //   adddata.DriverSecondUrl =[]
          // }
          dispatch(addReset({
            ...adddata
          }))
          setStore('addData', adddata, 'session')
          browserHistory.push(`/weizhang/addFlate`);
        }else {
          console.log(message);
        }
      })
    },
  }
}

const mapfuncToComponent = (dispatch, state) => {
  return {
    componentWillMount : () => {
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { noCustomerUserPhone = false } = customer

      // const handleClose = Loading()
      // let customerUserId = getStore('customerUserId', 'session');
      // get(`/weizhang/v1/${customerUserId}/plate`).then(({ code, data, message} ) => {
      //   if(code===0 && data.length>0){
      //       let dataAll = data;
      //       let datalist = [];
      //       for(let i in data){
      //         let phone = ''
      //         if (noCustomerUserPhone) {
      //           phone = dataAll[i].carPhone
      //         } else {
      //           phone = getStore('userPhone', 'session')
      //         }
      //         get('/weizhang/v1/query',{ ...dataAll[i],
      //                                   'channel':'chexingyi',
      //                                   phone,
      //                                   'userId': getStore('customerUserId', 'session')})
      //             .then(({ code, data, message} ) => {
      //               if(code===0){
      //                 datalist.push({ plateNumber:dataAll[i].plateNumber,goAdd:false,peccancyList:data,dataAll:dataAll[i] })
      //               }else {
      //                 datalist.push({plateNumber:dataAll[i].plateNumber,goAdd:true,dataAll:dataAll[i]})
      //               }
      //               if(datalist.length == dataAll.length){
      //                 handleClose()
      //                 dispatch(secReset({
      //                   datalist
      //                 }))
      //               }
      //             })
      //       }
      //
      //   }else {
      //     handleClose()
      //     console.log(message);
      //   }
      //   handleClose()
      // })
      // .catch(({ message }) => {
      //   handleClose()
      // })
      const getURL = (sendURL, sendData) => {
        return new Promise((resolve, reject) => {
          get(sendURL, sendData).then(({ code, data, message }) => {
            if (code === 0) {
              resolve(data)
            } else {
              reject(new Error(message))
            }
          })
        })
      }
      const request = {
        plateAll: () => {
          return getURL(`/weizhang/v1/${ getStore('customerUserId', 'session') }/plate`)
        },
        pecliAll: () => {
          return getURL('/weizhang/v1/check/user/plates', { channel: 'chexingyi', userId: getStore('customerUserId', 'session') })
        },
      }
      const main = () => {
        return Promise.all([request.plateAll(), request.pecliAll()])
      }
      // 运行示例
      const handleClose = Loading()
      main().then(value => {
        handleClose()
        const plateAll = value[0]
        const pecliAll = value[1]
        const datalist = plateAll.reduce((arr, p) => {
          keys(pecliAll).some(e => e == p.id) ? arr.push({ plateNumber: p.plateNumber, goAdd: false, peccancyList: pecliAll[p.id], dataAll: p })
                                              : arr.push({ plateNumber: p.plateNumber, goAdd: true, dataAll: p })
          return arr
        }, [])
        dispatch(secReset({
          datalist
        }))
        console.log(plateAll, pecliAll, datalist)
      }).catch(error => {
        handleClose()
        console.log(error)
      })
    },
    componentDidMount: () => {
      document.title = '违章缴费'
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapfuncToComponent)(Second))
