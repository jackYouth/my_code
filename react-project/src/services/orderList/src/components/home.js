import React from 'react';
import ReactDOM from 'react-dom';
import { getStore } from '@boluome/common-lib'
import { Tabs, WhiteSpace } from 'antd-mobile';

class OrdersList extends React.Component{

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange(key) {
    switch (key) {
      case '1':
        console.log(111);
        this.feachOrdersList();
        break;
      case '2':
        console.log(222);
        this.feachOrdersList();
        break;
      case '3':
        console.log(333);
        this.feachOrdersList();
        break;
      default:
        console.log('default');
    }
  }

  feachOrdersList(){
    console.log('feachOrdersList');
  }

  render() {

    const TabPane = Tabs.TabPane;

    return (
      <div>
        <Tabs defaultActiveKey="1" swipeable = {false} onChange = { (key) => { this.handleChange(key) } } >
          <TabPane tab="所有订单" key="1">
            <div className = 'mainContainer'>
              <div className='noCoupon'>您还没有此类订单</div>
            </div>
          </TabPane>
          <TabPane tab="代付款" key="2">
            <div className = 'mainContainer'>

            </div>
          </TabPane>
          <TabPane tab="已取消" key="3">
            <div className = 'mainContainer'>

            </div>
          </TabPane>
          <TabPane tab="退款" key="4">
            <div className = 'mainContainer'>

            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default OrdersList
