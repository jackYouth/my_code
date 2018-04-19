import React, { Component } from 'react'
import { Carousel } from 'antd-mobile'
import '../style/wechatHome.scss'
import banner1   from '../image/banner1.png'
import banner2   from '../image/banner2.png'
import huafei    from '../image/huafei.png'
import jiayou    from '../image/jiayou.png'
import shenghuo  from '../image/shenghuojiaofei.png'
import weizhang  from '../image/weizhang.png'
import waimai    from '../image/waimai.png'
import dianyin   from '../image/dianyin.png'
import shengxian from '../image/shengxian.png'
import coffee    from '../image/coffee.png'
import paotui    from '../image/paotui.png'
import jiudian   from '../image/jiudian.png'
import jingdian  from '../image/jingdian.png'
import huoche    from '../image/huoche.png'
import jipiao    from '../image/jipiao.png'

class WechatHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          name:  '充值缴费',
          datas: [
            {
              serverName: '话费充值',
              img:        huafei,
              url:        'http://blm.test.otosaas.com/chongzhi/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
            {
              serverName: '加油卡充值',
              img:        jiayou,
              url:        'http://blm.test.otosaas.com/jiayouka/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
            {
              serverName: '生活缴费',
              img:        shenghuo,
              url:        'http://blm.test.otosaas.com/shenghuojiaofei/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
            {
              serverName: '违章缴费',
              img:        weizhang,
              url:        'http://blm.test.otosaas.com/weizhang/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
          ],
        }, {
          name:  '品质生活',
          datas: [
            {
              serverName: '外卖',
              img:        waimai,
              url:        'https://dev-me.otosaas.com/waimai/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
            {
              serverName: '电影',
              img:        dianyin,
              url:        'http://blm.test.otosaas.com/dianying/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
            {
              serverName: '水果生鲜',
              img:        shengxian,
              url:        'https://dev-me.otosaas.com/shengxian/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
            {
              serverName: '星巴克',
              img:        coffee,
              url:        'http://blm.test.otosaas.com/coffee/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
            {
              serverName: '跑腿代购',
              img:        paotui,
              url:        'http://blm.test.otosaas.com/paotui/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
          ],
        }, {
          name:  '商旅出行',
          datas: [
            {
              serverName: '酒店',
              img:        jiudian,
              url:        'https://dev-me.otosaas.com/jiudian/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
            {
              serverName: '景点',
              img:        jingdian,
              url:        'http://blm.test.otosaas.com/menpiao/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
            {
              serverName: '火车票',
              img:        huoche,
              url:        'https://dev-me.otosaas.com/huoche/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
            {
              serverName: '机票',
              img:        jipiao,
              url:        'https://dev-me.otosaas.com/jipiao/?customerUserId=gongzhonghao&customerUserPhone=13100000000',
            },
          ],
        },
      ],
    }
  }

  componentWillMount() {
  }

  render() {
    const { data = {} } = this.state
    console.log(data)
    return (
      <div className='wechat-home-container'>
        <div className='banner-container'>
          <Carousel className='my-carousel'
            infinite
            autoplay
            dotStyle={{ backgroundColor: '#ffab00', width: '.3rem', height: '.06rem', borderRadius: '0' }}
          >
            <img src={ banner1 } alt='banner1' />
            <img src={ banner2 } alt='banner2' />
          </Carousel>
        </div>
        {
          data.map(({ name, datas }) => {
            return (
              <div className='server-container' key={ name }>
                <div className='server-title-container'>
                  <i />
                  <span>{ name }</span>
                </div>
                <div className='server-main-container'>
                  {
                    datas.map(({ serverName, img, url }) => {
                      return (
                        <div href={ url } key={ serverName } className='server-box' onClick={ () => window.location.href = url }>
                          <img src={ img } alt={ serverName } />
                          <span>{ serverName }</span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default WechatHome
