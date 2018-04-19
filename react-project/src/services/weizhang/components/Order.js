import React from 'react';
import { Card, Accordion, Picker, WingBlank, Button, Flex, Icon, Grid, List, InputItem, WhiteSpace } from 'antd-mobile';
import { NewPromotion, PromotionDisplay } from '@boluome/oto_saas_web_app_component'
import { createForm } from 'rc-form';
import chepai from '../img/chepai.png'
import carlife from '../img/carlife.png'

import "../style/order.scss"

const Item = List.Item;
const Brief = Item.Brief;



const Order = (order) => {
  const { peccalist, orderConfig, goAddflate, handleSubmit, handlePromotionChange, curDiscountData } = order;
  if (peccalist) {
    const { engineNo, vin, plateNumber, peccancyList } = peccalist;
    let untreated = 0
    let totalFine = 0
    let totalPoints = 0
    let totalserviceFee = 0
    let peccalists = peccancyList.violations.map((value,index) =>{

      const { selected = value.selected,canSelect = value.canSelect } = value

      if(selected == canSelect &&  selected == true) {
        console.log('selected+canSelect',selected,canSelect);
        untreated += 1
        totalFine += value.fine
        totalPoints += value.point
        totalserviceFee += value.serviceFee
        return(
          <List.Item key={index}>
              <Card>
                <Card.Header
                  title={<p>{value.time}<span>{value.status}</span></p>}
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
          </List.Item>
        )
      }

    });

    return(
        <div className="order">
          <div className="orderWrap">
            <List className="top">
                <Item
                  onClick={ () => goAddflate(peccalist,orderConfig) }
                  thumb={<Icon type={ require('svg/weizhang/chepai.svg') }  style={{marginLeft:'0.1rem',width: '0.6rem',height:'0.45rem'}} onClick={ () => handleGomycar() } />}
                  arrow="horizontal"><div><p>{plateNumber}</p><p><span>车架号：***{vin.substr(-4)}</span><span>发动机号：***{engineNo.substr(-4)}</span></p></div></Item>
            </List>

            <WhiteSpace  size="lg" />

            <Accordion accordion openAnimation={{}} className="my-accordion">
              <Accordion.Panel header={<p>代办罚单<span style={{float:'right'}}>{untreated}条</span></p>}>
                <List className="pecCard">
                  {peccalists}
                </List>
              </Accordion.Panel>
            </Accordion>
            <List>
                <Item extra={ <span>{ totalPoints }分</span> }>扣分总数</Item>
                <Item extra={ <span className="fontCol">¥{ totalFine.toFixed(2) }</span> }>罚款总额</Item>
                <Item extra={ <span className="fontCol">¥{ totalserviceFee.toFixed(2) }</span> }>代办费用</Item>
            </List>


            <WhiteSpace  size="lg" />
            <List>
              <NewPromotion handleChange={ handlePromotionChange } orderType="weizhang" channel='chexingyi' amount={ totalFine+totalserviceFee } count={ untreated } />
            </List>

            <WhiteSpace  size="lg" />
            <List>
              <Item extra={<span className="fontCol">¥{ (totalFine + totalserviceFee).toFixed(2) }</span>}>订单总额</Item>
              <PromotionDisplay coupon={ curDiscountData.coupon } activity={ curDiscountData.activity } />
            </List>

            <WingBlank size="md">
              <p className="tipInfo">1. 支付成功进入办理状态后，1-5个工作日处理完成；</p>
              <p className="tipInfo">2.处理完成后，1-7个工作日可消除违章记录。</p>
            </WingBlank>
          </div>
          <div className="pecBotm">
            ¥{ (totalFine + totalserviceFee - curDiscountData.discount).toFixed(2) }<span onClick={() => handleSubmit(orderConfig,peccalist,curDiscountData)}>立即下单</span>
          </div>
        </div>
      )
  }
  return(
      <div className="order">
        <div style={{ display: 'none' }}>加载中</div>
      </div>
    )
}

export const TipImg = ({imgsrc}) =>(
  <div className="wrapTipimg"><img src={imgsrc} /></div>
)


export default Order
