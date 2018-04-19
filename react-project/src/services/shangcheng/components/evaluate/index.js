import React from 'react'
import { getStore } from '@boluome/common-lib'
import { NewEvaluation } from '@boluome/oto_saas_web_app_component'
import { TextareaItem, Icon } from 'antd-mobile'
import { createForm } from 'rc-form'

import PicSelect from '../common-component/picture-upload'

import '../../styles/evaluate/index.scss'

const Evaluate = props => {
  const { orderInfo, handleSelectStar, appraises = {}, handleButtonClick, handleChangeImg } = props
  if (!orderInfo) return <div />
  const { subOrders, id, channel, brandId } = orderInfo
  if (!appraises.express) appraises.express = { score: 5 }
  if (!appraises.server) appraises.server = { score: 5 }
  const expressScore = appraises.express.score
  const serviceScore = appraises.server.score

  console.log('subOrders', subOrders)
  const paras = {
    channel,
    expressScore,
    serviceScore,
    brandId,
    orderId:   id,
    userId:    getStore('customerUserId', 'session'),
    appraises: subOrders.map(o => ({
      commodityId:     o.commodityId,
      specificationId: o.specificationId,
      commodityUrl:    o.icon,
      userComment:     appraises[o.specificationId] && appraises[o.specificationId].userComment ? appraises[o.specificationId].userComment : '',
      score:           appraises[o.specificationId] && appraises[o.specificationId].score ? appraises[o.specificationId].score : '5',
      imgs:            appraises[o.specificationId] && appraises[o.specificationId].imgs ? appraises[o.specificationId].imgs.map(oo => oo.url) : [],
    })),
  }
  return (
    <div className='evaluate'>
      {
        subOrders.map(data => <CommodityItem { ...{ data, orginProps: props, handleChangeImg } } key={ data } />)
      }
      <div className='brand-evaluate'>
        <div className='brand-evaluate-header'>
          <Icon type={ require('svg/shangcheng/brand.svg') } size='md' />
          <span>店铺评分</span>
        </div>
        <div className='brand-evaluate-text'>
          <span>物流服务</span>
          <NewEvaluation defaultValue={ expressScore } width={ '2rem' } integerMode={ 1 } handleSelectStar={ res => handleSelectStar(res, 'express', appraises) } />
        </div>
        <div className='brand-evaluate-text'>
          <span>服务态度</span>
          <NewEvaluation defaultValue={ serviceScore } width={ '2rem' } integerMode={ 1 } handleSelectStar={ res => handleSelectStar(res, 'server', appraises) } />
        </div>
      </div>
      <p className='evaluate-button' onClick={ () => handleButtonClick(paras) }>发布评价</p>
    </div>
  )
}

class CommodityItemMid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentValue: '',
    }
  }
  handleValueChange(currentValue, specificationId, appraises) {
    const { handleTextareaChange } = this.props.orginProps
    this.setState({ currentValue })
    handleTextareaChange(currentValue, specificationId, appraises)
  }
  render() {
    const { currentValue } = this.state
    const { form, data, orginProps, handleChangeImg } = this.props
    const { getFieldProps } = form
    const { icon, specificationId } = data
    // appraises: 评价信息的列表
    const { handleSelectStar, appraises = {} } = orginProps
    if (!appraises[specificationId]) appraises[specificationId] = { score: 5, imgs: [] }
    const score = appraises[specificationId].score
    const imgs = appraises[specificationId].imgs
    let evaluateText = '好评'
    const scoreMid = score

    if (scoreMid >= 3 && scoreMid < 4) evaluateText = '中评'
    if (scoreMid < 3) evaluateText = '差评'
    return (
      <div className='commodity-item'>
        <div className='commodity-item-header'>
          <p className='brand-img'><img src={ icon } alt='brand_image' /></p>
          <NewEvaluation defaultValue={ score } width={ '2.75rem' } integerMode={ 1 } handleSelectStar={ res => handleSelectStar(res, specificationId, appraises) } />
          <p className='evaluate-status'>{ evaluateText }</p>
        </div>
        <TextareaItem
          {
            ...getFieldProps('count', {
              initialValue: '',
            })
          }
          onChange={ e => this.handleValueChange(e, specificationId, appraises) }
          value={ currentValue }
          placeholder='商品满足您的期待吗？说说它的优点和美中不足的地方吧～'
          rows={ 4 }
          count={ 120 }
        />
        <PicSelect imgs={ imgs } handleChangeImg={ files => handleChangeImg(files, specificationId, appraises) } />
      </div>
    )
  }
}

const CommodityItem = createForm()(CommodityItemMid)

export default Evaluate
