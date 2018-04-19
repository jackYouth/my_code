import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/huoche' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='moredata' component={ require('react-router?name=moredata!./containers/moredata') } />
      <Route path='timelist' component={ require('react-router?name=timelist!./components/timelist') } />
      <Route path='details' component={ require('react-router?name=details!./containers/details') } />
      <Route path='cardtime' component={ require('react-router?name=cardtime!./components/cardtime') } />
      <Route path='order' component={ require('react-router?name=order!./containers/order') } />
      <Route path='ordernotice' component={ require('react-router?name=ordernotice!./components/ordernotice') } />
      <Route path='addtourist' component={ require('react-router?name=addtourist!./components/addtourist') } />
      <Route path='filter' component={ require('react-router?name=filter!./components/filter') } />
      <Route path='orderDetails/:id' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
      <Route path='ShowPromotion' component={ require('react-router?name=ShowPromotion!./components/ShowPromotion') } />
      <Route path='InvoiceDetails' component={ require('react-router?name=InvoiceDetails!./components/InvoiceDetails') } />
      <Route path='AccidentCom' component={ require('react-router?name=AccidentCom!./components/AccidentCom') } />
      <Route path='AccidentRistMask' component={ require('react-router?name=AccidentRistMask!./components/AccidentRistMask') } />
      <Route path='PassengerInformCom' component={ require('react-router?name=PassengerInformCom!./components/PassengerInformCom') } />
      <Route path='RefundCom' component={ require('react-router?name=RefundCom!./components/RefundCom') } />
      <Route path='RefundInfoCom' component={ require('react-router?name=RefundInfoCom!./components/RefundInfoCom') } />
      <Route path='OrderRefundCom' component={ require('react-router?name=OrderRefundCom!./components/OrderRefundCom') } />
      <Route path='AddPeople' component={ require('react-router?name=AddPeople!./components/AddPeople') } />
      <Route path='grabticket' component={ require('react-router?name=grabticket!./containers/grabticket') } />
      <Route path='alternative' component={ require('react-router?name=alternative!./components/alternative') } />
      <Route path='alternativetime' component={ require('react-router?name=alternativetime!./components/alternativetime') } />
      <Route path='alternativespeed' component={ require('react-router?name=alternativespeed!./components/alternativespeed') } />
      <Route path='stoptime' component={ require('react-router?name=stoptime!./components/stoptime') } />
      <Route path='SelectTrain' component={ require('react-router?name=SelectTrain!./components/SelectTrain') } />
      <Route path='ordergrab' component={ require('react-router?name=ordergrab!./containers/ordergrab') } />
      <Route path='SeatTime' component={ require('react-router?name=SeatTime!./components/SeatTime') } />
      <Route path='ChangeSign' component={ require('react-router?name=ChangeSign!./components/ChangeSign') } />
      <Route path='City' component={ require('react-router?name=City!./containers/City') } />
      <Route path='NoticeMask' component={ require('react-router?name=NoticeMask!./components/NoticeMask') } />
      <Route path='refund' component={ require('react-router?name=refund!./containers/refund') } />
    </Route>
  </Router>
)
export default Routes
