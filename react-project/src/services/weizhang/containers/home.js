import React from "react"
import {connect} from  "react-redux"
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Home, { TipImg } from "../components/Home.js"
import { setServerUrl, getStore, setStore } from "@boluome/common-lib"
import { Mask, wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { Toast, Modal } from 'antd-mobile';

import { get, send, customerCode, login, getCustomerConfig, getLocationGaode } from 'business'

const alert = Modal.alert;

const showAlert = (msg) => {
  alert('温馨提示', msg , [
    { text: '确定', onPress: () => console.log('cancel'), style: 'default' },
  ]);
};

import { homeReset, pecReset } from "../actions/home.js"

const mapStateToProps = (state, props) => {
  const { home } = state;
  const keyData = [0,1,2,3,4,5,6,7,8,9,'Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'];
  return {
    ...home,
    keyData
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    handleGomycar: () => {
      event.preventDefault()
      if(getStore('customerUserId', 'session')){
        browserHistory.push(`/weizhang/mycar`)
      }else{
        Toast.info('用户未登录', 1);
      }
    },

    handleTipImg: (imgsrc) => {
      Mask(<TipImg imgsrc={imgsrc} />)
    },

    handleChangevin: vin => dispatch(homeReset({
      vin
    })),

    handleChangeengineNo: engineNo => dispatch(homeReset({
      engineNo
    })),

    handleCarPhone: carPhone => dispatch(homeReset({
      carPhone
    })),

    changeCurrentIndex: currentIndex => dispatch(homeReset({
      currentIndex
    })),

    changeCurrent: (plateNumber,currentIndex) => {
      //索引的更改及当作删除函数使用
      if(1<=currentIndex && currentIndex<=6){
        let arr = JSON.parse(JSON.stringify(plateNumber));
        arr[currentIndex] = '';
        dispatch(homeReset({
          plateNumber : arr
        }));
        currentIndex--;
      }
      dispatch(homeReset({
        currentIndex
      }))
    },

    handleKeydown: (e,plateNumber,currentIndex) => {
      let arr = JSON.parse(JSON.stringify(plateNumber));
      arr[currentIndex] = e.target.innerHTML;
      dispatch(homeReset({
        plateNumber : arr
      }));
      //判断车牌号前缀，查询所在城市
      if(currentIndex == 1){
        get('/weizhang/v1/plate/city',{'channel':'chexingyi','platePrefix':arr[0]+arr[1]}).then(({ code, data, message} ) => {
          if(code===0){
            dispatch(homeReset({
              ...data[0]
            }));
          }else if(code===20000) {
            console.log(message);
          }
        })
      }
      currentIndex++;
      if(0<=currentIndex && currentIndex<=6){
        dispatch(homeReset({
          currentIndex
        }))
      }
    },

    handleSubmit: ({ cityId, cityName, plateNumber, vin, engineNo, vinLength, engineNoLength, carPhone, noCustomerUserPhone}) => {
      let customerUserId = getStore('customerUserId', 'session');
      const reg = /^1[34578]\d{9}$/
      if (!customerUserId) {
        Toast.info('用户未登录', 1);
      } else if (plateNumber.join('').length < 7){
        Toast.info('请输入正确车牌号', 1);
      } else if (!vin || ((vinLength == 0 || vinLength == 99) ?false:vinLength!==vin.length)){
        Toast.info('请输入正确车架号', 1);
      } else if (!engineNo || ((engineNoLength == 0 || engineNoLength == 99) ? false:engineNoLength!==engineNo.length)){
        Toast.info('请输入正确发动机号', 1);
      } else if (noCustomerUserPhone && !carPhone){
        Toast.info('请输入手机号', 1);
      } else if (noCustomerUserPhone && !(reg.test(carPhone))) {
        Toast.info('请输入正确手机号', 1);
      } else {
        let sendData = {}
        if (noCustomerUserPhone) {
          sendData = {'channel':'chexingyi',
                      'cityName':cityName,
                      'cityId':cityId,
                      'plateNumber':plateNumber.join(''),
                      'vin':vin,
                      'engineNo':engineNo,
                      'carPhone': carPhone,
                      'userId': customerUserId,
                    }
        } else {
          sendData = {'channel':'chexingyi',
                      'cityName':cityName,
                      'cityId':cityId,
                      'plateNumber':plateNumber.join(''),
                      'vin':vin,
                      'engineNo':engineNo,
                      'phone': getStore('userPhone', 'session'),
                      'userId': customerUserId,
                    }
        }
        // let handleClose = Loading()
        get('/weizhang/v1/query', sendData)
            .then(({ code, data, message} ) => {
              // handleClose()
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
                  const pecData = {
                    peccancyList:data,
                    cityId:cityId,
                    cityName:cityName,
                    plateNumber:plateNumber.join(''),
                    id:data.plateId,
                    vin:vin,
                    engineNo:engineNo,
                    carPhone: carPhone,
                    quanxuan,
                    noQuanxuan
                  }
                  setStore('pecBool', true, 'session')
                  setStore('pecData', pecData, 'session')
                  browserHistory.push(`/weizhang/peccancy`)
              }else {
                showAlert(message);
                console.log(message);
              }
            })
      }

    },
  }
}

const mapfuncToComponent = (dispatch, state) => {
  return {
    componentWillMount : () => {

      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { noCustomerUserPhone = false } = customer
      dispatch(homeReset({
        noCustomerUserPhone
      }))
          const handleClose = Loading()
          login((err, { customerUserId, userPhone }) => {  //登陆
            if(err) {
              //登陆失败
              Toast.info('登录失败', 1);
              pre();
              handleClose();
            }else{
              get(`/weizhang/v1/${customerUserId}/plate`).then(({ code, data, message} ) => {
                if(code===0){
                  if(data.length == 0){
                    handleClose();
                    pre();
                  }else {
                    handleClose();
                    browserHistory.replace(`/weizhang/second`);
                  }
                }else {
                  handleClose();
                  console.log(message);
                }
              })
            }
          })

      let pre = () =>{

        let getCity = () =>{
          get('/weizhang/v1/city/platePrefixs',{'channel':'chexingyi',
                                    'cityName':getStore('currentPosition', 'session').city.replace("市","")}).then(({ code, data, message} ) => {
            if(code===0){
              dispatch(homeReset({
                cityId:data.id,
                cityName:data.name,
                plateNumber:[data.platePrefix.substr(0,1),'','','','','',''],
                goSecond:true
              }))
            }else {
              console.log(message);
            }
          })
        }

        if(getStore('currentPosition', 'session')){
            getCity();
        }else{
          getLocationGaode((err, point)=>{
              getCity();
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

            dispatch({ type : "FIRST", prefix: season })
            dispatch(homeReset({ goSecond:true }))
          }else {
            console.log(message);
          }
        })
      }


    },
    componentDidMount: () => {
      document.title = '违章缴费'
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapfuncToComponent)(Home))
