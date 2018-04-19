import React from 'react';
import ReactDOM from 'react-dom';
import { getStore , get , send } from '@boluome/common-lib'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { Tabs, WhiteSpace } from 'antd-mobile';
import { login } from 'business'
// export const customerCode = location.host.replace(/(.test.otosaas.com|.otosaas.com)/, '')

const usingMockData = false

class couponsList extends React.Component{

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange(key) {
    let postData = {
      userId : getStore('customerUserId','session'),
      type : Number(key)
    }
    this.feachCouponList(postData)
  }

  componentWillMount(){
    let postData = {
      userId : getStore('customerUserId','session'),
      type : 1
    }

    // getCustomerConfig(customerCode, () => {
      login(err => {
        if(err) {
          // this.feachCouponList(postData)
          console.log('login err', err)
        } else {
          this.feachCouponList(postData)
        }
      })
    // })

  }

  feachCouponList(postData){
    const handleClose = Loading()
    send('/promotion/get_coupon_list' , postData ,'post')
    .then(({ code, data = {}, message }) => {
      if(usingMockData) {
        code = 0
        data = mockData
      }
      if ( code === 0 ){
        const { coupons } = data
        this.setState({ coupons })
        console.log(coupons);
      } else {
        console.log(message);
      }
      handleClose()
    })
  }

  render() {

    const TabPane = Tabs.TabPane;
    const { coupons = [] } = this.state
    const tabList = [{ type:"可使用",key:1},{ type:"已使用",key:2},{ type:"已过期",key:3}]

    return (
      <div style={{height:'100%'}}>
        <Tabs defaultActiveKey="1" swipeable = { false } onChange = { (key) => { this.handleChange(key) } } >
          {
            tabList.map(({type ,key}) => (
              <TabPane tab={ type } key={ key }>
                <div className = 'mainContainer'>
                  {
                    coupons.length > 0 ?
                      <ul>
                        {
                          coupons.map( ({ id , title , subtitle , value , sts , ets }, index) => (
                            <li key={ `arr-${ index }` }>
                              <div className={ key == 3 ? 'couponBox unusable' : 'couponBox usable' }>
                                <div className='discountValue'>
                                  <span>¥</span>
                                  <span>{ value }</span>
                                </div>
                                <div className='titleBox'>
                                  <p className='title'>{ title }</p>
                                  <p className='subtitle'>{ subtitle }</p>
                                </div>
                                <div className='validPeriod'>
                                  <span>使用期限：</span>
                                  <span>{ new Date(sts).getFullYear() + '.' + new Date(sts).getMonth() + '.' + new Date(sts).getDate() }</span>
                                  <span> 至 </span>
                                  <span>{ new Date(ets).getFullYear() + '.' + new Date(ets).getMonth() + '.' + new Date(ets).getDate() }</span>
                                </div>
                              </div>
                            </li>
                          ))
                        }
                      </ul> : <div className='noCoupon'>您还没有此类红包</div>
                  }
                </div>
              </TabPane>
            ))
          }
        </Tabs>
      </div>
    )
  }
}

export default couponsList



//测试数据，修改target看效果
const mockData = {

  "couponNum": 0,
  "payPrice": 32.0,
  "target": "coupon",
  "activity": {
    "mutex": 1,
    "deductionPrice": 10,
    "subtitle": null,
    "id": "584a0b1f18d2462600e3e6bd",
    "title": "\u6ee125\u7acb\u51cf10\u5143"
  },
  coupons: [
    {
          "discount": 1,
          "deductionPrice": 12,
          "subtitle": "\u6ee125\u5143\u53ef\u7528",
          "title": "12\u5143\u5916\u5356\u4f18\u60e0\u5238",
          "threshold": 25,
          "mutex": 1,
          "ets": 1480608000.0,
          "type": 1,
          "id": "100000042926",
          "value": 12,
          "sts": 1488297600000,
          "ets": 1490002365722
      }, {
          "discount": 1,
          "deductionPrice": 0,
          "subtitle": "\u6ee125\u5143\u53ef\u7528",
          "title": "12\u5143\u5916\u5356\u4f18\u60e0\u5238",
          "threshold": 25,
          "mutex": 1,
          "ets": 1480608000.0,
          "type": 1,
          "id": "100000042927",
          "value": 12,
          "sts": 1488297600000,
          "ets": 1490002365722
      }, {
          "discount": 1,
          "deductionPrice": 12,
          "subtitle": "\u6ee125\u5143\u53ef\u7528",
          "title": "12\u5143\u5916\u5356\u4f18\u60e0\u5238",
          "threshold": 25,
          "mutex": 1,
          "ets": 1480608000.0,
          "type": 1,   // price - deducationPrice
          "id": "100000042931",
          "value": 12,
          "sts": 1488297600000,
          "ets": 1490002365722
      }
    ]
}
