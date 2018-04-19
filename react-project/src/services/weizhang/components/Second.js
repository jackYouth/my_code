import React from 'react';
import { Picker, WingBlank, Button, Flex, Icon, Grid, List, InputItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import { UserCenter } from "@boluome/oto_saas_web_app_component"

import chepai from '../img/chepai.png'
import mine from '../img/mine.png'

import "../style/second.scss"

const Item = List.Item;



const Second = ({ datalist, goAddflate, goPeclsst, handleGomycar }) => {

    let secondList = datalist.map((value,index) =>{
        let { peccancyList, dataAll } = value;

        return(
          <Item
            key={index}
            arrow="horizontal"
            className="noFlex"
            onClick={()=>{value.goAdd?goAddflate(value.plateNumber,dataAll):goPeclsst(dataAll)}}
            extra={value.goAdd?(<p className="danger">车辆信息有误</p>)
                              :(<div>
                                  <p><span>违规&nbsp;&nbsp;<b>{peccancyList.untreated}次</b></span><span>扣分&nbsp;&nbsp;<b>{peccancyList.totalPoints}分</b></span></p>
                                  <p><span>罚款&nbsp;&nbsp;<b>¥{peccancyList.totalFine}</b></span></p>
                                </div>)}>
            <span>{value.plateNumber.substr(0,2)}·{value.plateNumber.substr(2)}</span>
          </Item>
      	)

    });

return (
  <div className="second">
    <UserCenter categoryCode="weizhang" orderTypes='weizhang' />
    <List>
        <Item
           onClick={ () => handleGomycar() }
           extra={<Icon type={ require('svg/weizhang/chepai.svg') }  style={{marginLeft:'0.1rem',width: '0.6rem',height:'0.45rem'}} />}
           arrow="horizontal">
           我的车牌
        </Item>
        {secondList}
    </List>
  </div>
)}


export default Second
