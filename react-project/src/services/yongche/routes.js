import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/yongche' component={ require('react-router?name=root!./components/root') } >
      <Route path='invoice' component={ require('react-router?name=invoice!./components/invoice') }>
        <IndexRoute component={ require('react-router?name=invoiceInfo!./containers/invoice-info') } />
        <Route path='history' component={ require('react-router?name=history!./containers/invoice-history') } />
      </Route>
      <Route path='rules' component={ require('react-router?name=priceRules!./components/price-rules') } />
      <Route path='order/:orderId' component={ require('react-router?name=orderId!./components/order') }>
        <IndexRoute component={ require('react-router?name=order!./containers/order-id') } />
        <Route path='cancel' component={ require('react-router?name=cancel!./containers/order-cancel') } />
      </Route>
      <Route path=':channel/stroke' component={ require('react-router?name=stroke!./containers/stroke') } />
      <Route path=':channel' component={ require('react-router?name=channel!./components/channel') }>
        <IndexRoute component={ require('react-router?name=channel!./containers/product') } />
        <Route path=':productType' component={ require('react-router?name=channel!./containers/plane') } />
      </Route>
    </Route>
  </Router>
)
export default Routes
