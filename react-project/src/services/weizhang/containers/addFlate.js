import React from "react"
import {connect} from  "react-redux"
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import AddFlate, { TipImg, DetalImg } from "../components/AddFlate.js"
import { setServerUrl, getStore, parseLocName } from "@boluome/common-lib"
import { Mask, Loading, wrap } from '@boluome/oto_saas_web_app_component'
import { Toast, Modal } from 'antd-mobile';
import { get, send, getLocationGaode } from 'business'
const alert = Modal.alert;

import { addReset, orderReset } from "../actions/addFlate.js"

const mapStateToProps = (state, props) => {
    const { addFlate } = state
    const keyData = [0,1,2,3,4,5,6,7,8,9,'Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'];
  return {
    ...addFlate,
    keyData
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
    changeCurrentIndex: (currentIndex, e) => {
      console.log(currentIndex)
      dispatch(addReset({
        currentIndex
      }))
    },
    changeState:(data,name) => {
      let temp= {[name]:data};
      dispatch(addReset({
          ...temp
      }))
    },
    changeImg: (url, name) => {
      let temp= { [name]: url }
      dispatch(addReset({
        ...temp
      }))
    },
    goOrder:(addFlateData,orderConfig)=>{
      if (addFlateData.carPhone ? !(/^1(3|4|5|7|8)\d{9}$/.test(addFlateData.carPhone)) : false) {
        Toast.info('手机号格式不正确', 1);
      }else if (addFlateData.FilePhone ? !(/^1(3|4|5|7|8)\d{9}$/.test(addFlateData.FilePhone)) : false) {
        Toast.info('手机号格式不正确', 1);
      }else{
        let handleClose = Loading()
        let customerUserId = getStore('customerUserId', 'session');
        const submitData = {
          cityId:           addFlateData.cityId,
          cityName:         addFlateData.cityName,
          plateNumber:      addFlateData.plateNumber.join(''),
          id:               addFlateData.id,
          vin:              addFlateData.vin,
          engineNo:         addFlateData.engineNo,
          carPhone:         addFlateData.carPhone,
          carName:          addFlateData.carName,
          CardNo:           addFlateData.CardNo,
          FileNumber:       addFlateData.FileNumber,
          FilePhone:        addFlateData.FilePhone,
          XingShiZhengHao:  addFlateData.XingShiZhengHao,
          CheliangZhengShu: addFlateData.CheliangZhengShu,
          DrivingUrl:       addFlateData.DrivingUrl,
          DrivingSecondUrl: addFlateData.DrivingSecondUrl,
          DriverUrl:        addFlateData.DriverUrl,
          DriverSecondUrl:  addFlateData.DriverSecondUrl,
          QRCode:           addFlateData.QRCode,
        }
        send('/weizhang/v1/plate',{
                                    ...submitData,
                                   'userId': getStore('customerUserId','session')
                                  })
        .then(({ code, data, message} ) => {
          handleClose()
          if(code===0){
              Object.assign(submitData, orderConfig);
              delete submitData.id;
              dispatch(orderReset({
                orderConfig: submitData,
              }))
              browserHistory.push(`/weizhang/order`);
          }else{
            Toast.info(message, 1);
          }
        })
      }

    },
    changeCurrent: (plateNumber,currentIndex) => {
      //索引的更改及当作删除函数使用
      if(1<=currentIndex && currentIndex<=6){
        let arr = JSON.parse(JSON.stringify(plateNumber));
        arr[currentIndex] = '';
        dispatch(addReset({
          plateNumber : arr
        }));
        currentIndex--;
      }
      dispatch(addReset({
        currentIndex
      }))
    },
    handleKeydown: (e,plateNumber,currentIndex) => {
      let arr = JSON.parse(JSON.stringify(plateNumber));
      arr[currentIndex] = e.target.innerHTML;
      dispatch(addReset({
        plateNumber : arr
      }));
      //判断车牌号前缀，查询所在城市
      if((currentIndex == 1 || currentIndex == 0) && arr[0] && arr[1]){
        get('/weizhang/v1/plate/city',{'channel':'chexingyi','platePrefix':arr[0]+arr[1]}).then(({ code, data, message} ) => {
          if(code===0){
            dispatch(addReset({
              ...data[0]
            }));
          }else if(code===20000) {
            console.log(message);
          }
        })
      }
      currentIndex++;
      if(0<=currentIndex && currentIndex<=6){
        dispatch(addReset({
          currentIndex
        }))
      }
    },
    handleSubmit: addFlateData => {
      let submit = handleClose => {
          const submitData = {
            cityId:           addFlateData.cityId,
            cityName:         addFlateData.cityName,
            plateNumber:      addFlateData.plateNumber.join(''),
            id:               addFlateData.id,
            vin:              addFlateData.vin,
            engineNo:         addFlateData.engineNo,
            carPhone:         addFlateData.carPhone,
            carName:          addFlateData.carName,
            CardNo:           addFlateData.CardNo,
            FileNumber:       addFlateData.FileNumber,
            FilePhone:        addFlateData.FilePhone,
            XingShiZhengHao:  addFlateData.XingShiZhengHao,
            CheliangZhengShu: addFlateData.CheliangZhengShu,
            DrivingUrl:       addFlateData.DrivingUrl,
            DrivingSecondUrl: addFlateData.DrivingSecondUrl,
            DriverUrl:        addFlateData.DriverUrl,
            DriverSecondUrl:  addFlateData.DriverSecondUrl,
            QRCode:           addFlateData.QRCode,
          }
          send('/weizhang/v1/plate',{
                                      ...submitData,
                                     'userId': getStore('customerUserId','session')
                                    })
          .then(({ code, data, message} ) => {
            handleClose()
            if(code===0){
                browserHistory.push(`/weizhang/second`)
            }else{
              Toast.info(message, 1)
            }
          })
      }

      let showAlert = (handleClose) => {
        handleClose()
        alert('温馨提示', '此车牌已保存，请去我的车牌页面进行编辑', [
          { text: '我知道了', onPress: () => {
              browserHistory.push(`/weizhang/mycar`)
          } },
        ])
      };
      const reg = /^1[34578]\d{9}$/
      if(addFlateData.plateNumber.length < 7){
        Toast.info('请填写车牌号', 1);
      }else if(!addFlateData.vin || ((addFlateData.vinLength == 0 || addFlateData.vinLength == 99) ?false:addFlateData.vinLength!==addFlateData.vin.length)){
        Toast.info('请填写正确车架号', 1);
      }else if(!addFlateData.engineNo || ((addFlateData.engineNoLength == 0 || addFlateData.engineNoLength == 99) ?false:addFlateData.engineNoLength!==addFlateData.engineNo.length)){
        Toast.info('请填写正确发动机号', 1);
      }else if((!addFlateData.noCustomerUserPhone && !addFlateData.carPhone) ? false : !(reg.test(addFlateData.carPhone))){
        Toast.info('手机号格式不正确', 1);
      }else if(addFlateData.FilePhone?!(reg.test(addFlateData.FilePhone)):false){
        Toast.info('手机号格式不正确', 1);
      }else{
        let handleClose = Loading()
        let customerUserId = getStore('customerUserId', 'session')
        if(addFlateData.id){
            submit(handleClose);
        }else{
          get(`/weizhang/v1/${ customerUserId }/plate`).then(({ code, data, message} ) => {
            if(code === 0){
                if(data.some(e => e.plateNumber == addFlateData.plateNumber.join(''))){
                  showAlert(handleClose)
                }else{
                  submit(handleClose)
                }
            }else {
              handleClose()
              console.log(message);
            }
          })
        }
      }

    },

  }
}

const mapfuncToComponent = (dispatch, state) => {
  return {
    componentWillMount : () => {
      const addData = getStore('addData', 'session')
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { noCustomerUserPhone = false } = customer
      let getCity = handleClose =>{
        get('/weizhang/v1/city/platePrefixs',{'channel':'chexingyi',
                                  'cityName': getStore('currentPosition', 'session') ? parseLocName(getStore('currentPosition', 'session').city) : '北京' })
        .then(({ code, data, message} ) => {
          handleClose()
          if(code===0){
            dispatch(addReset({
              cityId:data.id,
              cityName:data.name,
              plateNumber:[data.platePrefix.substr(0,1),'','','','','','']
            }))
          }else {
            console.log(message);
          }
          // let reg = /^http/
          // for (let v in addData) {
          //   if (reg.test(addData[v])) {
          //     addData[v] = [{ url: addData[v] }]
          //   }
          // }
          // if (!addData.CheliangZhengShu) {
          //   addData.CheliangZhengShu = []
          // }
          // if (!addData.DriverUrl) {
          //   addData.DriverUrl = []
          // }
          // if (!addData.DriverSecondUrl) {
          //   addData.DriverSecondUrl = []
          // }
          console.log(addData)
          dispatch(addReset({
            noCustomerUserPhone,
            ...addData,
          }))
        })
      }
      console.log(state)
      const handleClose = Loading()
      if(getStore('currentPosition', 'session')) {
          console.log('gggg1')
          getCity(handleClose)
      } else {
        console.log('gggg2')
          getLocationGaode(err =>{
            if (err) {
              Toast.info('定位失败', 1)
              getCity(handleClose)
            } else {
              getCity(handleClose)
            }
        });
      }

      get('/weizhang/v1/plate/prefix').then(({ code, data, message} ) => {
        if(code===0){
          //调整数据格式
          let season = [];

          season = data.reduce((arr, { city, prefix }) => {
            arr.push({
              label: city,
              value: city,
              children: prefix.map(p => ({ label: p, value: p }))
            })
            return arr
          }, [])

          dispatch({ type : "ADD_PREFIX", prefix: season })
        }else {
          console.log(message);
        }
      })
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapfuncToComponent)(AddFlate))
