import React from 'react';
import { ImagePicker, Picker, WingBlank, Button, Flex, Icon, Grid, List, InputItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form'
import Picselect from './picselect.js'
import chepai from '../img/chepai.png'
import arrowdown from '../img/arrowDown.png'
import fadongjitip from '../img/fadongjitip.png'
import jiazhaotip from '../img/jiazhaotip.png'
import cheliangdengjizhengshu from '../img/cheliangdengjizhengshu.png'
import xingshizhengfan from '../img/xingshizhengfan.png'
import xingshizhengzheng from '../img/xingshizhengzheng.png'
import jiashizhengma from '../img/jiashizhengma.png'
import jiashizhengfan from '../img/jiashizhengfan.png'
import jiashizhengzheng from '../img/jiashizhengzheng.png'
import key from '../img/key.png'

import "../style/addFlate.scss"

const Item = List.Item;
const Brief = Item.Brief;



const AddFlate = addFlateData => {
  const { readOnly,
          prefix,
          vin,
          engineNo,
          cityName,
          cityId,
          currentIndex,
          plateNumber,
          keyData,
          carName,
          carPhone,
          CardNo,
          FileNumber,
          FilePhone,
          CheliangZhengShu,
          XingShiZhengHao,
          DriverUrl,
          DriverSecondUrl,
          QRCode,
          DrivingUrl,
          DrivingSecondUrl,
          vinLength ,
          engineNoLength,
          orderConfig,
          noCustomerUserPhone,
          changeState, handleSubmit ,handleTipImg , handleDetalImg,changeCurrentIndex, handleKeydown, changeCurrent, changeImg, goOrder } = addFlateData;
  let datas;
  console.log(addFlateData)
  if(currentIndex==0){
    datas = prefix;
  }else if(currentIndex==1){
    datas = keyData.map(o => ({
      value: o,
      selectedNo: prefix.filter(p => p.value === plateNumber[0])[0].children.some(c => c.value === o)
    }));
  }else{
    datas = keyData;
  }
  let plateNumbers= plateNumber.map((o, i) => {
    console.log(o, i)
    return(
        <li onClick={ e => { e.nativeEvent.stopImmediatePropagation(); changeCurrentIndex(i) } }  key={ `keyboard${ i }-${ Math.random() }` }><span className={ currentIndex === i ? 'selectNow' : '' }>{ o }</span></li>
      )
    })
    if (typeof noCustomerUserPhone == 'boolean') {
      return(
          <div className="addFlate">
              { readOnly && <div className="nomask" /> }

              <List renderHeader={() => {return (<p>基本信息<span className='redTip'>（* 必填）</span></p>)}}>
                  <Item><span className='redTip'>* </span>车牌号码</Item>
                  <Item>
                     <div className="flateNew">
                       <ul onClick={ e => { e.stopPropagation() } } ref={ node => {
                           if(node) {
                             document.onclick = () => {
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
                    onChange={ e => changeState(e ,'vin') }
                    extra={<span onClick={ () => handleTipImg(jiazhaotip) } type="check"><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>}
                  ><span className='redTip'>* </span>车架号</InputItem>
              </List>



              <WhiteSpace size="lg" />
              <List>
                  <InputItem
                    placeholder={(engineNoLength == 0 || engineNoLength == 99) ?`请输入全部发动机号`:`请输入发动机号后${engineNoLength}位`}
                    maxLength = {(engineNoLength == 0 || engineNoLength == 99) ?false:engineNoLength}
                    value={engineNo}
                    onChange={e => changeState(e ,'engineNo') }
                    extra={<span onClick={ () => handleTipImg(fadongjitip) } type="check"><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>}
                  ><span className='redTip'>* </span>发动机号</InputItem>
              </List>

              { noCustomerUserPhone &&
                <div>
                  <WhiteSpace size="lg" />
                    <List>
                        <InputItem
                          placeholder="请输入车主电话"
                          value={carPhone}
                          onChange={e => changeState(e ,'carPhone') }
                        ><span className='redTip'>* </span>车主电话</InputItem>
                    </List>
                </div>
              }


              <List className="moreinfo" renderHeader={() => '更多信息'}>
                  <InputItem
                    placeholder="请输入姓名"
                    value={carName}
                    onChange={e => changeState(e ,'carName') }
                  >车主姓名</InputItem>

                  { !noCustomerUserPhone &&
                    <InputItem
                      placeholder="请输入车主电话"
                      value={carPhone}
                      onChange={e => changeState(e ,'carPhone') }
                    >车主电话</InputItem>
                  }

                  <InputItem
                    placeholder="请输入手机号码"
                    value={FilePhone}
                    onChange={e => changeState(e ,'FilePhone') }
                  >驾驶证登记手机号</InputItem>

                  <InputItem
                    placeholder="请输入驾驶证号"
                    value={CardNo}
                    onChange={e => changeState(e ,'CardNo') }
                  >驾驶证号</InputItem>

                  <InputItem
                    placeholder="请输入驾驶证档案编号"
                    value={FileNumber}
                    onChange={e => changeState(e ,'FileNumber') }
                  >驾驶证档案编号</InputItem>


                  <Item multipleLine>
                    <span onClick={ () => handleTipImg(jiashizhengzheng) } type="check"><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                    驾驶证正面照
                    <Brief>
                      <Picselect files={ DriverUrl } onChangeimg={ res => changeImg(res, 'DriverUrl') } handleDetalImg={ handleDetalImg } />
                    </Brief>
                  </Item>

                  <Item multipleLine>
                    <span onClick={ () => handleTipImg(jiashizhengfan) } type="check"><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                    驾驶证副页照
                    <Brief>
                      <Picselect files={ DriverSecondUrl } onChangeimg={ res => changeImg(res, 'DriverSecondUrl') } handleDetalImg={ handleDetalImg } />
                    </Brief>
                  </Item>

                  <Item multipleLine>
                    <span onClick={ () => handleTipImg(jiashizhengma) } type="check"><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                    驾驶证副条形码照
                    <Brief>
                      <Picselect files={ QRCode } onChangeimg={ res => changeImg(res, 'QRCode') } handleDetalImg={ handleDetalImg } />
                    </Brief>
                  </Item>

              </List>

              <WhiteSpace  size="lg" />
              <List className="moreinfo">

                <Item multipleLine>
                  <span onClick={ () => handleTipImg(xingshizhengzheng) } type="check"><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                  行驶证正面照
                  <Brief>
                    <Picselect files={ DrivingUrl } onChangeimg={ res => changeImg(res, 'DrivingUrl') } handleDetalImg={ handleDetalImg } />
                  </Brief>
                </Item>

                <Item multipleLine>
                  <span onClick={ () => handleTipImg(xingshizhengfan) } type="check"><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                  行驶证反面照
                  <Brief>
                    <Picselect files={ DrivingSecondUrl } onChangeimg={ res => changeImg(res, 'DrivingSecondUrl') } handleDetalImg={ handleDetalImg } />
                  </Brief>
                </Item>

                <InputItem
                  placeholder="请输入行驶证档案编号"
                  value={XingShiZhengHao}
                  onChange={e => changeState(e ,'XingShiZhengHao') }
                >行驶证档案编号</InputItem>

              </List>


              <WhiteSpace  size="lg" />
              <List className="moreinfo">
                <Item multipleLine>
                  <span onClick={ () => handleTipImg(cheliangdengjizhengshu) } type="check"><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                  车辆登记证书照
                  <Brief>
                    <Picselect files={ CheliangZhengShu } onChangeimg={ res => changeImg(res, 'CheliangZhengShu') } handleDetalImg={ handleDetalImg } />
                  </Brief>
                </Item>

              </List>


              <WhiteSpace size="lg" />
              <WingBlank size="md">
                <p style={{color: '#666666',marginBottom:'0.15rem'}}>注：</p>
                <p className="tipInfo">1、行驶证照片需与车牌信息保持一致，并正副页清晰可识别<br/>
                2、请确保车辆登记证书号清晰可识别<br/>
                提交的信息仅限办理违章业务，车行易将严格为您保密，
                如有问题，请联系: <span style={{color: '#ffab00'}}>4009910008</span></p>
              </WingBlank>


              <WhiteSpace size="lg" />
              { readOnly == false && <WingBlank size="lg"><Button className="btn" onClick={ () => handleSubmit(addFlateData) } >保存</Button></WingBlank> }
              { readOnly == true && <WingBlank size="lg"><Button className="btn" onClick={ () => goOrder(addFlateData,orderConfig) } >确认</Button></WingBlank> }

              { (currentIndex || currentIndex === 0) && <Keyboard keyboard={datas} handleKeydown={handleKeydown} changeCurrentIndex={changeCurrentIndex} plateNumber={plateNumber} currentIndex={currentIndex} changeCurrent={changeCurrent} /> }

          </div>
        )
    }
    return <div />
}

export const TipImg = ({imgsrc}) =>(
  <div className="wrapTipimg"><img src={imgsrc} /></div>
)
export const DetalImg = ({imgsrc}) =>(
  <div className="detalImg"><img src={imgsrc} /></div>
)

const Keyboard = ({keyboard=[], handleKeydown, changeCurrentIndex, currentIndex, plateNumber, changeCurrent }) =>{
  let keylist = keyboard.map((value,index) =>{
    return (
      <li key={ `keyboard-${ Math.random() }` } className={ (!value.selectedNo && currentIndex === 1) ? 'selectedNo':'' }  onClick={ e => { e.nativeEvent.stopImmediatePropagation(); value.selectedNo || currentIndex !== 1 ? handleKeydown(e,plateNumber,currentIndex) : '' } }>{value.value||value.value===0?value.value:value}</li>
    )
  })

  console.log(keylist.length)
  return(
    <div className="keyboard">
      <p><span onClick={ () => { changeCurrentIndex('') } }>确定</span></p>
      <ul>{keylist}</ul>
      <span className='cancel' onClick={ e => { e.nativeEvent.stopImmediatePropagation(); changeCurrent(plateNumber,currentIndex) } }><img src={ key }/></span>
    </div>
  )
}

export default AddFlate
