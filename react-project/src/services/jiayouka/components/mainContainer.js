import React from 'react'
import { getStore } from '@boluome/common-lib'
import { PayTips } from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import { Icon } from 'antd-mobile'
import OilCardPrice from '../containers/oilCardPrice'
import './css/mainContainer.scss'

const MainContainer = props => {
  // console.log('mainContainer props--=-=-=-=-==-', props)
  const { cardsList } = props
  const { currId } = props
  let showInfo = {}

  if (!currId) {
    showInfo = cardsList[0]
  } else {
    for (let i = 0; i < cardsList.length; i++) {
      if (cardsList[i].id === currId) {
        showInfo = cardsList[i]
        // console.log(showInfo)
      } else {
        // showInfo = cardsList[0]
      }
    }
    // console.log(showInfo)
  }

  const inforZSH = (
    <div className='oilCardText'>
      <h3>温馨提示</h3>
      <p>1、充值后金额自动存储在“待圈存金额中”，使用时需到售卡网点或自助终端设备上进行加油卡圈存操作；</p>
      <p>2、中石化加油卡仅支持状态正常的主卡充值，副卡及损坏卡、报失卡，过期卡等均不能充值。</p>
      <p>3、充值前请确认充值卡号，一但充值成功，不支持退款服务。</p>
    </div>
  )

  const inforZSY = (
    <div className='oilCardText'>
      <h3>温馨提示</h3>
      <p>1、每个用户仅可绑定一个证件办理的一张或多张中石油加油卡。</p>
      <p>2、如需开发票，请携带昆仑加油卡前往开户地指定发卡充值网点领取。</p>
    </div>
  )

  const inforContainer = Number(getStore('categoryId', 'session')) === 1 ? inforZSH : inforZSY

  return (
    <div className='mainContainer'>
      <div className='oilCardBox'>
        <div className='ocbInfo'>
          <p style={{ marginTop: !showInfo.userName ? '.2rem' : '' }} >{ showInfo.cardId }</p>
          {
            showInfo.userName ? <span>{ showInfo.userName }</span> : ''
          }
        </div>
        <div className='ocbImg' onClick={ () => browserHistory.push('/jiayouka/CardsList') }>
          <Icon type={ require('./img/jiayouka.svg') } />
        </div>
      </div>
      <div className='oilCardInfo'>
        <OilCardPrice oilPrice={ props.oilPrice } currIndex='0' />
        { inforContainer }
      </div>
      <div className='oilCard-tips-constainer' style={{ marginBottom: '1.13rem' }}>
        <PayTips title='加油卡充值提示' content={ <Content /> } />
      </div>
    </div>
  )
}

export default MainContainer

const Content = () => {
  return (
    <div>
      <p>如何申请加油卡</p>
      <div>目前只支持线下办卡。用户可携带个人有效证件原件，前往任意加油站发卡充值网点申请，填写开户申请单，即可申请加油卡。</div>
      <br />
      <p>如何给加油卡充值</p>
      <div>按照页面引导，输入加油卡号和必要信息，填写充值金额，完成支付。通过本服务充值后，需去油站或发卡点圈存。</div>
      <br />
      <p>什么叫圈存</p>
      <div>圈存指您线上充值完成后，需到加油站或发卡点同步充值金额到加油卡中。只有圈存后才能获取您通过本服务进行充值的金额。</div>
      <br />
      <p>如何删除加油卡</p>
      <div>在加油卡充值页面，点击加油卡号右侧的【加油图标】——选定需要删除的加油卡——在选定的加油卡右侧，点击【删除图标】，即可删除选定加油卡。</div>
      <br />
      <p>加油卡充值金额限制</p>
      <div>个别支付方式会根据您的使用环境及历史交易情况综合判定并随时调整您的单笔/日/月充值次数及金额，若您如果发生充值失败的情况，请联系酷屏的客服咨询具体原因。联系电话4009910008。</div>
    </div>
  )
}
