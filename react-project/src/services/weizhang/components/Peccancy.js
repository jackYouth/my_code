import React from 'react';
import { Checkbox, Card, Picker, WingBlank, Button, Flex, Icon, Grid, List, InputItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';

import "../style/peccancy.scss"

import nopec from '../img/nopec.png'
import qxoff from '../img/quanxuan_off.png'
import qxon from '../img/quanxuan_on.png'

const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;

const Peccancy = (props) =>{
  const {quanxuan, noQuanxuan, plateNumber, peccancyList, handleChangesel, handleQuanxuan, handleMsg, handleSubmit} = props


  if(peccancyList && peccancyList.violations.length>0){
    let untreated = 0
    let totalFine = 0
    let totalPoints = 0
    let totalserviceFee = 0
    let peccancyLists = peccancyList.violations.map((value,index) =>{

      const { selected = value.selected } = value

      if(selected) {
        untreated += 1
        totalFine += value.fine
        totalPoints += value.point
        totalserviceFee += value.serviceFee
      }

      return(
        <CheckboxItem key={index} wrap checked={value.selected} disabled={!value.canSelect} onChange={e => handleChangesel(quanxuan, value, peccancyList)}>
            <Card>
              <Card.Header
                title={<p>{value.time}<span>{ value.msg && <Icon onClick={ e => { handleMsg(e, value.msg) } } className='tipImg' type={ require('svg/weizhang/tipr.svg') } /> }{value.status}</span></p>}
              />
              <Card.Body>
                <div>{value.reason}</div>
                <p>{value.address}</p>
              </Card.Body>
              <Card.Footer content={<Flex>
                <Flex.Item className="cardFootli">
                    扣分<span>{value.point}</span>
                </Flex.Item>
                <Flex.Item className="cardFootli">
                    罚款<span>¥{value.fine}</span>
                </Flex.Item>
                <Flex.Item className="cardFootli">
                    代办费<span>¥{value.serviceFee}</span>
                </Flex.Item>
              </Flex>} />
            </Card>
        </CheckboxItem>
    	)
    });
    return (
      <div className="peccancy">
        <div className="listWarp">
            <Flex className="header">

              <Flex.Item style={{'flex':4}}>
                  <div className="flateDiv">{plateNumber.substr(0,2)}·{plateNumber.substr(2)}</div>
              </Flex.Item>

              <Flex.Item style={{'flex':6}}>
                <Flex>
                  <Flex.Item style={{'flex':9}}>
                      违规<span>{untreated}次</span>
                  </Flex.Item>
                  <Flex.Item style={{'flex':10}}>
                      扣分<span className="koufen">{totalPoints}分</span>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item style={{'flex':9}}>
                      罚款<span>¥{totalFine}</span>
                  </Flex.Item>
                  <Flex.Item style={{'flex':10}}>
                      代办费<span>¥{totalserviceFee}</span>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
            </Flex>


          <WhiteSpace size="lg" />
          <List>
              {peccancyLists}
          </List>

        </div>
        <div className="pecBotm">
          <div>
            <span onClick={ noQuanxuan? () => handleQuanxuan(quanxuan, peccancyList):false } >
              <Icon className='img' type={ quanxuan ? require('svg/weizhang/qxon.svg') : require('svg/weizhang/qxoff.svg') } />
              全选
            </span>
            <p>合计&nbsp;<span>￥{totalFine+totalserviceFee}</span></p>
          </div>
          <p className={ noQuanxuan?false:"noQuanxuan" } onClick={ noQuanxuan?() => handleSubmit(props):false}>立即代缴</p>
        </div>


      </div>
    )
  }else if (peccancyList) {
    return(
      <div className="peccancy">
        <div className="nopec">
          <div>
            <span><img src={nopec}/></span>
            <p>秋名山老司机，请带我飞！</p>
            <p>当前没有查到违章噢，过段时间再来看看吧</p>
          </div>
        </div>
      </div>
    )
  }
  return(
    <div className="peccancy">
      <div style={{ display: 'none' }}>
        加载中
      </div>
    </div>
  )

}

export default Peccancy
