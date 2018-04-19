import React from 'react';
import { ImagePicker, Picker, WingBlank, Button, Flex, Icon, Grid, List, InputItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form'
import Picselect from './picselect.js'
import chepai from '../img/chepai.png'
import arrowdown from '../img/arrowDown.png'
import icInfo from '../img/icInfo.png'
import fadongjitip from '../img/fadongjitip.png'
import jiazhaotip from '../img/jiazhaotip.png'
import cheliangdengjizhengshu from '../img/cheliangdengjizhengshu.png'
import xingshizhengfan from '../img/xingshizhengfan.png'
import xingshizhengzheng from '../img/xingshizhengzheng.png'
import jiashizhengma from '../img/jiashizhengma.png'
import jiashizhengfan from '../img/jiashizhengfan.png'
import jiashizhengzheng from '../img/jiashizhengzheng.png'

import '../style/condition.scss'

const Item = List.Item;
const Brief = Item.Brief;



const Condition = (condition) => {
  const { yanzheng, peccalist, condiData, data, changeState, handleSubmit ,handleTipImg, sendYanzheng, handleDetalImg } = condition;
  if (condiData) {
    let { vin,
          engineNo,
          cityName,
          cityId,
          carName,
          carPhone,
          CardNo,
          FileNumber,
          FilePhone,
          CheliangZhengShu,
          XingShiZhengHao,
          DriverUrl,
          DriverSecondUrl,
          DrivingUrl,
          DrivingSecondUrl,
          VerifyCode} = condiData;

    return(
        <div className='condition'>


            <List className='moreinfo' renderHeader={() => {return (<p>根据交通管理局在线办理违章的要求<br/>您需要补齐以下 车主／车辆 信息</p>)}}>


              { condiData.hasOwnProperty('carName')&& [<InputItem
                placeholder='请输入姓名'
                value={carName}
                onChange={e => changeState(e ,'carName',condiData) }
              >车主姓名</InputItem>]}
              { condiData.hasOwnProperty('carPhone') && [<InputItem
                placeholder='请输入车主电话'
                value={carPhone}
                onChange={e => changeState(e ,'carPhone',condiData) }
              >车主电话</InputItem>]}

              { condiData.hasOwnProperty('FilePhone') && [<InputItem
                placeholder='请输入手机号码'
                value={FilePhone}
                onChange={e => changeState(e ,'FilePhone',condiData) }
              >驾驶证登记手机号</InputItem>]}

              { condiData.hasOwnProperty('CardNo') && [<InputItem
                placeholder='请输入驾驶证号'
                value={CardNo}
                onChange={e => changeState(e ,'CardNo',condiData) }
              >驾驶证号</InputItem>]}

              { condiData.hasOwnProperty('FileNumber') && [<InputItem
                placeholder='请输入驾驶证档案编号'
                value={FileNumber}
                onChange={e => changeState(e ,'FileNumber',condiData) }
              >驾驶证档案编号</InputItem>]}


              { condiData.hasOwnProperty('XingShiZhengHao') && [<InputItem
                placeholder='请输入行驶证档案编号'
                value={XingShiZhengHao}
                onChange={e => changeState(e ,'XingShiZhengHao',condiData) }
              >行驶证档案编号</InputItem>]}


              { condiData.hasOwnProperty('VerifyCode') && [<InputItem
                placeholder='请输入验证码'
                extra={<span className={ yanzheng?'yanzhengma':'yanzhengm'} onclick={() => {yanzheng && sendYanzheng(peccalist.plateNumber)} }>发送</span>}
                value={VerifyCode}
                onChange={e => changeState(e ,'VerifyCode',condiData) }
              >验证码</InputItem>]}
            </List>

            <WhiteSpace  size='lg' />
            <List className='moreinfo'>

              { condiData.hasOwnProperty('DriverUrl') && <Item multipleLine>
                <span onClick={ () => handleTipImg(jiashizhengzheng) } type='check'><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                驾驶证正面照
                <Brief>
                  <Picselect files={ DriverUrl } onChangeimg={ res => changeState(res, 'DriverUrl', condiData) } handleDetalImg={ handleDetalImg } />
                </Brief>
              </Item> }

              { condiData.hasOwnProperty('DriverSecondUrl') && <Item multipleLine>
                <span onClick={ () => handleTipImg(jiashizhengfan) } type='check'><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                驾驶证副页照
                <Brief>
                  <Picselect files={ DriverSecondUrl } onChangeimg={ res => changeState(res, 'DriverSecondUrl', condiData) } handleDetalImg={ handleDetalImg } />
                </Brief>
              </Item> }

              { condiData.hasOwnProperty('QRCode') && <Item multipleLine>
                <span onClick={ () => handleTipImg(jiashizhengma) } type='check'><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                驾驶证副条形码照
                <Brief>
                  <Picselect files={ QRCode } onChangeimg={ res => changeState(res, 'QRCode', condiData) } handleDetalImg={ handleDetalImg } />
                </Brief>
              </Item> }

              { condiData.hasOwnProperty('DrivingUrl') && <Item multipleLine>
                <span onClick={ () => handleTipImg(xingshizhengzheng) } type='check'><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                行驶证正面照
                <Brief>
                  <Picselect files={ DrivingUrl } onChangeimg={ res => changeState(res, 'DrivingUrl', condiData) } handleDetalImg={ handleDetalImg } />
                </Brief>
              </Item> }

              { condiData.hasOwnProperty('DrivingSecondUrl') && <Item multipleLine>
                <span onClick={ () => handleTipImg(xingshizhengfan) } type='check'><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                行驶证反面照
                <Brief>
                  <Picselect files={ DrivingSecondUrl } onChangeimg={ res => changeState(res, 'DrivingSecondUrl', condiData) } handleDetalImg={ handleDetalImg } />
                </Brief>
              </Item> }

              { condiData.hasOwnProperty('XingShiZhengHao') && <InputItem
                placeholder='请输入行驶证档案编号'
                value={XingShiZhengHao}
                onChange={e => changeState(e ,'XingShiZhengHao') }
              >行驶证档案编号</InputItem> }

              { condiData.hasOwnProperty('CheliangZhengShu') && <Item multipleLine>
                <span onClick={ () => handleTipImg(cheliangdengjizhengshu) } type='check'><Icon className='tipImg' type={ require('svg/weizhang/tip.svg') } /></span>
                车辆登记证书照
                <Brief>
                  <Picselect files={ CheliangZhengShu } onChangeimg={ res => changeState(res, 'CheliangZhengShu', condiData) } handleDetalImg={ handleDetalImg } />
                </Brief>
              </Item> }

            </List>


            <WhiteSpace size='lg' />
            <WingBlank size='md'>
              <p style={{color: '#666666',marginBottom:'0.15rem'}}>注：</p>
              <p className='tipInfo'>提交的信息仅限办理违章业务，车行易将严格为您保密，<br/>如有问题，请联系: <span style={{color: '#ffab00'}}>4009910008</span></p>
            </WingBlank>


            <WhiteSpace size='lg' />
            <WingBlank size='lg'><Button className='btn' onClick={ () => handleSubmit(peccalist,condiData,data) } >提交</Button></WingBlank>


        </div>
      )
  }
  return(
    <div className='condition'>
      <div style={{ display: 'none' }}>
        加载中
      </div>
    </div>
  )
}

export const TipImg = ({imgsrc}) =>(
  <div className='wrapTipimg'><img src={imgsrc} /></div>
)

export const DetalImg = ({imgsrc}) =>(
  <div className="detalImg"><img src={imgsrc} /></div>
)


export default Condition
