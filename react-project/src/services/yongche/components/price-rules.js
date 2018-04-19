import React, { Component } from 'react'
import { getStore } from '@boluome/common-lib'
import { Carousel } from 'antd-mobile'

import '../styles/price-rules.scss'

const szPriceList = {
  ljjc: [
    ['公务轿车', 15, 0.5, 2.8, 1.4, 15, 3],
    ['商务7座', 20, 0.7, 4.5, 1.5, 15, 4.2],
    ['豪华轿车', 23, 0.8, 4.6, 1.8, 15, 4.8],
  ],
  yyjc: [
    ['公务轿车', 50, 0.5, 4.2, 3],
    ['商务7座', 70, 0.7, 6, 4.2],
    ['豪华轿车', 78, 0.8, 6.4, 4.8],
  ],
}

const ljjc = szPriceList.ljjc.map(item => (
  {
    name:      item[0],
    basePrice: [
      {
        name:  '*起租价',
        price: `¥${ item[1] }`,
      },
      {
        name:  '*时长费',
        price: `¥${ item[2] }/分钟`,
      },
      {
        name:  '*里程费',
        price: `¥${ item[3] }/公里`,
      },
      {
        name:  '*远途费',
        price: `¥${ item[4] }/公里`,
        title: '超过15公里时，超出部分按里程收取',
      },
      {
        name:  '出城费',
        price: `¥${ item[5] }/公里`,
      },
    ],
  }
))
// 只有预约叫车时，神州的计价规则才不一样
const yyjc = szPriceList.ljjc.map(item => (
  {
    name:      item[0],
    basePrice: [
      {
        name:  '*套餐价',
        price: `¥${ item[1] }`,
        title: '含8公里20分钟',
      },
      {
        name:  '*超时费',
        price: `¥${ item[2] }/分钟`,
        title: '超出套餐包含的时长后，超出部分按分钟收取',
      },
      {
        name:  '*超里程费',
        price: `¥${ item[3] }/公里`,
        title: '超出套餐包含的里程后，超出部分按里程收取',
      },
      {
        name:  '出城费',
        price: `¥${ item[4] }/公里`,
      },
    ],
  }
))

const shenzhouListData = [ljjc, yyjc]

const priceListData = [
  {
    name:      '舒适型',
    basePrice: [
      {
        name:  '起步价',
        price: '17元',
      },
      {
        name:  '里程费',
        price: '3.2元／公里',
        title: '每0.1公里结算',
        data:  [
          { left: '07:00 - 10:00', right: '3.4 元／公里' },
          { left: '23:00 - 00:00', right: '3.9 元／公里' },
          { left: '00:00 - 05:00', right: '3.9 元／公里' },
        ],
      },
      {
        name:  '低速费',
        price: '0.5元／分钟',
        title: '速度<12公里/小时为低速；',
        data:  [
          { left: '07:00 - 10:00', right: '1.4 元／分钟' },
          { left: '17:00 - 20:00', right: '3.9 元／分钟' },
        ],
      },
      {
        name:  '远途费',
        price: '1.3元／公里',
        title: '超过10公里后加收远途费；',
      },
    ],
    moreServer: [
      {
        name:  '儿童座椅服务',
        price: '0元／次',
      },
    ],
    minConsumption: '60元',
  },
  {
    name:      '商务型',
    basePrice: [
      {
        name:  '起步价',
        price: '19元',
      },
      {
        name:  '里程费',
        price: '4.5元／公里',
        title: '每0.1公里结算',
        data:  [
          { left: '23:00 - 00:00', right: '6.8 元／公里' },
          { left: '00:00 - 05:00', right: '6.8 元／公里' },
        ],
      },
      {
        name:  '低速费',
        price: '1.5元／分钟',
        title: '速度<12公里/小时为低速；',
        data:  [
          { left: '07:00 - 10:00', right: '1.5 元／分钟' },
          { left: '17:00 - 20:00', right: '1.5 元／分钟' },
        ],
      },
      {
        name:  '远途费',
        price: '2.3元／公里',
        title: '超过10公里后加收远途费；',
      },
    ],
    moreServer: [
      {
        name:  '儿童座椅服务',
        price: '0元／次',
      },
    ],
    minConsumption: '70元',
  },
  {
    name:      '豪华型',
    basePrice: [
      {
        name:  '起步价',
        price: '25元',
      },
      {
        name:  '里程费',
        price: '5元／公里',
      },
      {
        name:  '最低消费',
        price: '48元',
        title: '里程费、时长费合计不足最低消费时，直接按最低消费额计费',
      },
      {
        name:  '低速费',
        price: '2元／分钟',
        title: '速度<12公里/小时为低速；',
        data:  [
          { left: '07:00 - 10:00', right: '2 元／分钟' },
          { left: '17:00 - 20:00', right: '2 元／分钟' },
        ],
      },
      {
        name:  '远途费',
        price: '2.5元／公里',
        title: '超过15公里后加收远途费；',
      },
      {
        name:  '夜间费',
        price: '2.3元／公里',
        title: '夜间（23:00 - 05:00次日）行驶时，加收夜间服务费',
      },
    ],
    minConsumption: '108元',
  },
]

export default class PriceRules extends Component {
  static defaultProps = {
    imgsArr: [
      require('../img/ridetype1.png'),
      require('../img/ridetype2.png'),
      require('../img/ridetype3.png'),
    ],
  }

  constructor(props) {
    super(props)
    this.channel = getStore('channel', 'session')
    this.state = {
      priceList:    priceListData,
      currentIndex: 0,
    }
    this.handleChangeCarousel = this.handleChangeCarousel.bind(this)
  }

  handleChangeCarousel(currentIndex) {
    this.setState({ currentIndex })
  }

  render() {
    const { priceList, currentIndex } = this.state
    const productType = getStore('productType', 'session')
    const { imgsArr } = this.props
    let currentPriceDetail = priceList[currentIndex]
    if (this.channel === 'shenzhou') {
      currentPriceDetail = shenzhouListData[0][currentIndex]
      // 神州只有预约叫车和立即叫车计价规则不一样，其他都和立即叫车计价规则一样
      if (productType === '13') currentPriceDetail = shenzhouListData[1][currentIndex]
    }
    const { name, basePrice, moreServer, minConsumption } = currentPriceDetail

    return (
      <div className='price-rules'>
        <Carousel
          className='my-carousel rules-carousel'
          autoplay={ false }
          infinite
          selectedIndex={ 1 }
          swipeSpeed={ 35 }
          beforeChange={ (from, to) => console.log(`slide from ${ from } to ${ to }`) }
          afterChange={ this.handleChangeCarousel }
          style={{ height: '3.1rem', position: 'absolute', top: '.3rem' }}
          dotStyle={{ background: '#d8d8d8', width: '.07rem', height: '.08rem' }}
          dotActiveStyle={{ background: '#c7c7c7', width: '.07rem', height: '.08rem' }}
        >
          {
            imgsArr.map(ii => (
              <a href={ ii } key={ ii } className='my-carousel'>
                <img
                  src={ ii }
                  className='carousel-img'
                  alt='icon'
                />
              </a>
            ))
          }
        </Carousel>

        <div className='header'>
          <p className='bg-grey' />
          <p className='car-name'>{ name }</p>
        </div>
        {
          this.channel === 'shenzhou' &&
          <div className='bottom'>
            <div className='description'>
              <div className='title'>
                <p />
                <h5>收费标准</h5>
              </div>
              {
                basePrice && basePrice.map(item => (
                  <ul className='description-item' key={ item.name }>
                    <li className='description-header'>
                      { item.name && <p className='name'>{ item.name }</p> }
                      { item.price && <p className='price'>{ item.price }</p> }
                    </li>
                    { item.title && <li className='description-title'><p>{ item.title }</p></li> }
                    {
                      item.data && item.data.map(o => (
                        <li className='base-price' key={ o.left }>
                          <p className='base-left'>{ o.left }</p>
                          <p className='base-right'>{ o.right }</p>
                        </li>
                      ))
                    }
                  </ul>
                ))
              }
              <ol className='description-item top-style'>
                收费说明：
                <li className='description-title'>
                  <p>1、带*收费项目为基础收费项目，实际价格需要在此表基础上乘以当时、当地动态加价系数；</p>
                </li>
                <li className='description-title'>
                  <p>2、立即叫车的其他时间段计价规则同预约用车现有规则；</p>
                </li>
                <li className='description-title'>
                  <p>3、起步价：起步价为最低消费额。若起租价(或套餐价)、时长相关费用、里程相关费用、远途费、出城费等基础费用合计不足起步价时，按起步价计费；</p>
                </li>
                <li className='description-title'>
                  <p>4、出城费：客户上下车地点不在同一地级市时，按照两城市市中心坐标间的直线距离乘以出城费单价收取出城费；（注：城市市中心坐标由高德地图提供）</p>
                </li>
                <li className='description-title'>
                  <p>5、清洁费：如客户在用车时发生呕吐、踩蹬等情况造成车辆脏乱的，客户需额外支付清洁费：100元/次；</p>
                </li>
                <li className='description-title'>
                  <p>6、差旅费：连续多日订单，驾驶员需要陪同在异地过夜的情况下，客户需要按300元/晚的标准支付食宿费；连续多日订单但在同城内，驾驶员可回家休息的情况下，该费用用户不需要支付；</p>
                </li>
                <li className='description-title'>
                  <p>7、路桥费，停车费：用车过程中产生的路桥费（含高速费）、停车费等费用，由客户自行支付，客户要求驾驶员垫付的，按照实际发生金额的1.5倍收取；</p>
                </li>
                <li className='description-title'>
                  <p>
                    8、取消费：<br />
                    以下情况时，客户需支付取消费<br />
                    &nbsp;&nbsp;a、客户在驾驶员到达后取消或修改订单的；<br />
                    &nbsp;&nbsp;b、未在预订上车时间后15分钟内上车，且无法取得联系的。<br />
                    取消费标准：<br />
                    &nbsp;&nbsp;a、立即叫车、接机、送机：该产品起租价；<br />
                    &nbsp;&nbsp;b、预约用车：该产品套餐价；<br />
                    &nbsp;&nbsp;c、包车：100元/次；
                  </p>
                </li>
                <li className='description-title'>
                  <p>9、其他：预估费用仅供参考，实际费用可能因交通、天气或其他因素而不同。预估价不包含行程中产生的任何第三方费用（如路桥费、停车费等）。第三方费用需要您另行现金支付，如您选择线上支付（如账户余额、信用卡等），则支付金额为实际产生的第三方费用1.5倍。</p>
                </li>
              </ol>
            </div>
          </div>
        }

        {
          this.channel === 'didi' &&
          <div className='bottom'>
            <div className='description'>
              <div className='title'>
                <p />
                <h5>收费标准</h5>
              </div>
              {
                basePrice && basePrice.map(item => (
                  <ul className='description-item' key={ item.name }>
                    <li className='description-header'>
                      { item.name && <p className='name'>{ item.name }</p> }
                      { item.price && <p className='price'>{ item.price }</p> }
                    </li>
                    { item.title && <li className='description-title'><p>{ item.title }</p></li> }
                    {
                      item.data && item.data.map(o => (
                        <li className='base-price' key={ o.left }>
                          <p className='base-left'>{ o.left }</p>
                          <p className='base-right'>{ o.right }</p>
                        </li>
                      ))
                    }
                  </ul>
                ))
              }
              <ul className='description-item top-style'>
                <li className='description-header'>
                  <p className='name'>动态加价</p>
                </li>
                <li className='description-title'><p>当处于高峰时段、周围司机较少，或司机距离您较远的情况下，为了促进成交，鼓励司机更快接单，平台会对订单适当加价，加价金额全部给到司机。为保障乘客的利益与出行体验，加价会封顶不会无限制增加</p></li>
              </ul>
              {
                moreServer &&
                <ul className='description-item top-style'>
                  <li className='description-header'>
                    <p className='name'>更多服务</p>
                  </li>
                  {
                    moreServer.map(item => (
                      <li className='base-price' key={ item.name }>
                        <p className='base-left'>{ item.name }</p>
                        <p className='base-right'>{ item.price }</p>
                      </li>
                    ))
                  }
                </ul>
              }
              <ul className='description-item top-style'>
                <li className='description-title'><p>注：高速费、路桥费、停车费、其他费用按行驶过程中司机实际垫付的费用收取</p></li>
              </ul>
            </div>

            <div className='description description-b'>
              <div className='title'>
                <p />
                <h5>预约用车</h5>
              </div>
              <ul className='description-item'>
                <li className='description-header'>
                  <p className='name'>基础计价规则与实时计价保持一致</p>
                </li>
                <li className='base-price'>
                  <p className='base-left'>最低消费</p>
                  <p className='base-right'>{ minConsumption }</p>
                </li>
                <li className='description-title'><p>里程费、时长费合计不足最低消费时，直接按最低消费额计费</p></li>
              </ul>
              <ul className='description-item top-style'>
                <li className='description-title'><p>注：因司机接驾预约订单有更长的接驾和等待成本，为了保证服务质量，预约用车有最低消费限制</p></li>
              </ul>
            </div>
          </div>
        }
      </div>
    )
  }
}
