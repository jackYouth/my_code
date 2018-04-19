import React from "react"
import {connect} from  "react-redux"
import Mycar from "../components/Mycar.js"
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { setServerUrl, setStore, getStore } from "@boluome/common-lib"
import { wrap } from '@boluome/oto_saas_web_app_component'
import { homeReset, addReset } from "../actions/mycar.js"
import { get, send } from 'business'

const mapStateToProps = (state, props) => {
  const { mycar } = state
  return {
    ...mycar
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,
    handleGoadd: () => {
      dispatch({ type : "ADD_INIT"});
      setStore('addData', '', 'session')
      browserHistory.push(`/weizhang/addFlate`);
    },
    handleEdit: (index,flateList) => {
      flateList =JSON.parse(JSON.stringify(flateList))
      dispatch({ type : "ADD_INIT"});
      let plateNumber = flateList[index].plateNumber;
      let id = flateList[index].id
      let customerUserId = getStore('customerUserId', 'session');
      get(`/weizhang/v1/${customerUserId}/${plateNumber}/detail`, { 'userId': customerUserId, 'plateNumber': plateNumber, 'id': id }).then(({ code, data, message} ) => {
        if(code===0){
          flateList[index].plateNumber = flateList[index].plateNumber.split('')
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
            ...flateList[index]
          }
          setStore('addData', addData, 'session')
          browserHistory.push(`/weizhang/addFlate`);
        }else {
          console.log(message);
        }
      })
    },
    handleDelet: (index,flateList) => {
      let plateNumber = flateList[index].plateNumber
      let id = flateList[index].id
      let customerUserId = getStore('customerUserId', 'session');
      send(`/weizhang/v1/${ customerUserId }/${ plateNumber }`, { 'userId': customerUserId, 'plateNumber': plateNumber, 'id': id }, 'DELETE').then(({ code, data, message} ) => {
        if(code===0){
          flateList.splice(index, 1);
          dispatch({ type : "FLATE_LIST", flateList: flateList });
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
      let customerUserId = getStore('customerUserId', 'session');
      get(`/weizhang/v1/${customerUserId}/plate`).then(({ code, data, message} ) => {
        if(code===0){
          dispatch({ type : "FLATE_LIST", flateList: data })
        }else {
          console.log(message);
        }
      })
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapfuncToComponent)(Mycar))
