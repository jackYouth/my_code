import React from 'react';
import { Picker, WingBlank, Button, Flex, Icon, Grid, List, InputItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import { UserCenter, PayTips } from "@boluome/oto_saas_web_app_component"

import chepai from '../img/chepai.png'
import arrowdown from '../img/arrowDown.png'
import icInfo from '../img/icInfo.png'
import fadongjitip from '../img/fadongjitip.png'
import jiazhaotip from '../img/jiazhaotip.png'
import imgkey from '../img/key.png'
import mine from '../img/mine.png'

import "../style/home.scss"

const Item = List.Item;



const Home = home => {
    const { prefix, vin, engineNo, cityName, cityId, currentIndex, plateNumber, keyData, vinLength , engineNoLength, goSecond, noCustomerUserPhone, carPhone,
      handleCarPhone, handleSubmit ,handleChangevin ,handleChangeengineNo ,handleGomycar,handleTipImg,changeCurrentIndex, handleKeydown, changeCurrent } = home
    if (goSecond) {
      let datas;
      if(currentIndex === 0){
        datas= prefix;
      } else if(currentIndex === 1) {
        datas = keyData.map(o => ({
          value: o,
          selectedNo: prefix.filter(p => p.value === plateNumber[0])[0].children.some(c => c.value === o)
        }));
      } else {
        datas= keyData;
      }
      let plateNumbers= plateNumber.map((o, i) => {
        return(
            <li onClick={ e => { e.nativeEvent.stopImmediatePropagation(); changeCurrentIndex(i) } } key={ `fltnb${ i * 1 }` }><span className={ currentIndex === (i) ? 'selectNow' : '' }>{ o }</span></li>
          )
        })
      console.log(home)
      return (
        <div className="home">
        <UserCenter categoryCode="weizhang" orderTypes='weizhang' />
            <List>
                <Item
                   extra={<Icon type={ require('svg/weizhang/chepai.svg') }  style={{marginLeft:'0.1rem',width: '0.6rem',height:'0.45rem'}}  onClick={ () => handleGomycar() } />}
                   arrow="horizontal">车牌号码</Item>
                 <Item>
                   <div className="flateNew">
                     <ul ref={ node => {
                         if(node) {
                           document.onclick = e => {
                             changeCurrentIndex('')
                           }

                         }}}>{ plateNumbers }</ul>
                   </div>
                </Item>
            </List>



          <WhiteSpace  size="lg" />
          <List>
              <InputItem
                style={{paddingTop: '0.14rem',paddingBottom: '0.14rem',}}
                placeholder={(vinLength == 0 || vinLength == 99) ?`请输入全部车架号`:`请输入车架号后${vinLength}位`}
                maxLength = {(vinLength == 0 || vinLength == 99) ?false:vinLength}
                value={vin}
                onChange={e => handleChangevin(e) }
                extra={<span onClick={ () => handleTipImg(jiazhaotip) } type="check"><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>}
              >车架号</InputItem>
          </List>



          <WhiteSpace size="lg" />
          <List>
              <InputItem
                style={{paddingTop: '0.14rem',paddingBottom: '0.14rem',}}
                placeholder={(engineNoLength == 0 || engineNoLength == 99) ?`请输入全部发动机号`:`请输入发动机号后${engineNoLength}位`}
                maxLength = {(engineNoLength == 0 || engineNoLength == 99) ?false:engineNoLength}
                value={engineNo}
                onChange={e => handleChangeengineNo(e) }
                extra={<span onClick={ () => handleTipImg(fadongjitip) } type="check"><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>}
              >发动机号</InputItem>
          </List>

          <WhiteSpace size="lg" />
          { noCustomerUserPhone &&
            <List>
                <InputItem
                  placeholder="请输入车主电话"
                  value={carPhone}
                  maxLength = {11}
                  onChange={e => handleCarPhone(e) }>
                  车主电话
                </InputItem>
            </List>
          }

          <WingBlank size="md">
            <PayTips title='违章缴费说明' content={ <Content /> } />
          </WingBlank>
          <WhiteSpace size="lg" />

          <WingBlank size="lg"><Button className="btn" onClick={ () => handleSubmit({ cityId, cityName, plateNumber, vin, engineNo, vinLength, engineNoLength, carPhone, noCustomerUserPhone }) } >全国违章查询</Button></WingBlank>



          { (currentIndex || currentIndex === 0) && <Keyboard keyboard={ datas } handleKeydown={ handleKeydown } changeCurrentIndex={ changeCurrentIndex } plateNumber={ plateNumber } currentIndex={ currentIndex } changeCurrent={ changeCurrent } /> }
        </div>
      )
    }
    return(
      <div />
    )
}

export const TipImg = ({imgsrc}) =>(
  <div className="wrapTipimg"><img src={imgsrc} /></div>
)

const Content = () => (
  <div className='weizhangTip'>
    <h5>使用违章缴费服务，为什么需要手续费?</h5>
    <p>违章订单的手续费是违章代办渠道的成本费用，目前是不盈利的。不同地区的手续费不同。手续费会不定期调整。</p>

    <h5>已缴费订单为什么还是待处理状态？</h5>
    <p>违章订单受理成功后，外网（交警局官网）需要7个工作日左右消除，如逾期未消除，请与客服联系。</p>

    <h5>我的违章订单多久可以处理完毕?</h5>
    <p>一般情况下，您提交违章订单并支付成功后的3~5个工作日即可处理完毕。如遇节假日，办理时间会相应延迟。如需加急处理，请联系客服_4009910008_申请加急。</p>

    <h5>哪些违章订单可以代缴？</h5>
    <p>目前支持所有无扣分违章。</p>

    <h5>我有违章，为什么没有查询到相关违章信息？</h5>
        <p>1）车辆信息填写有误，请检查确认；<br />
        2）网络延迟，请稍后再试；<br />
        3）交管局数据录入更新延时，一般在14个工作日内同步完毕，建议到当地交管局网站核实。</p>
  </div>
)


const Keyboard = ({keyboard=[], handleKeydown, changeCurrentIndex, currentIndex, plateNumber, changeCurrent }) =>{
  let keylist = keyboard.map((value,index) =>{
    return (
      <li
        key={ `keyboard${ index * 1 }` }
        className={ !value.selectedNo && currentIndex === 1 ? 'selectedNo' : ''}
        onClick={ e => { e.nativeEvent.stopImmediatePropagation(); value.selectedNo || currentIndex !== 1 ? handleKeydown(e,plateNumber,currentIndex) : '' } }
        >
        { value.value || value.value === 0 ? value.value : value }
      </li>
    )
  })
  return(
    <div className='keyboard'>
      <p><span onClick={ () => changeCurrentIndex('') }>确定</span></p>
      <ul>{keylist}</ul>
      <span className="cancel" onClick={ e => { e.nativeEvent.stopImmediatePropagation(); changeCurrent(plateNumber,currentIndex) } }><img src={ imgkey }/></span>
    </div>
  )
}

export default Home
