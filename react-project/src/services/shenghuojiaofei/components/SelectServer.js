
import React from 'react'
import { getStore } from '@boluome/common-lib'
import { browserHistory } from 'react-router'

import '../styles/selectServer.scss'

import { Icon, Grid, Flex, WhiteSpace, Popup } from 'antd-mobile'


  const SelectServer = ({ selectedCity={ id: '' }, localCity, handleSelectCity,
                          service=[], handleSelectServer,
                          handleContainerClose, setHgt }) => {
     if (service) {
       let serviceInfo = [
         { name: '水费',     categoryId: '1001', cityId: selectedCity.id, hasServer: false, icon: 'sf_no' },
         { name: '电费',     categoryId: '1002', cityId: selectedCity.id, hasServer: false, icon: 'df_no' },
         { name: '燃气费',   categoryId: '1003', cityId: selectedCity.id, hasServer: false, icon: 'rqf_no' },
         { name: '有线电视',  categoryId: '3001', cityId: selectedCity.id, hasServer: false, icon: 'yxds_no' },
         { name: '固话',     categoryId: '7001', cityId: selectedCity.id, hasServer: false, icon: 'gh_no' },
         { name: '宽带',     categoryId: '7002', cityId: selectedCity.id, hasServer: false, icon: 'kd_no' },
         { name: '固话宽带',  categoryId: '4001', cityId: selectedCity.id, hasServer: false, icon: 'ghkd_no' },
         { name: '物业费',   categoryId: '5001', cityId: selectedCity.id, hasServer: false,  icon: 'wyf_no' }]

       serviceInfo.map((item) => {
         service.map((ser) => {
           if (ser.categoryId==item.categoryId && ser.isLive ==  '1') {
             item.hasServer  = true
             item.icon = item.icon.split('_')[0]
           }
         })
       })


       return (
         <div className='sIndex' style={ setHgt ? { height: setHgt } : { } } onClick={ () => setHgt && Popup.hide() } >
           <div className='header'>
             <div className='city-select'>
               <p onClick={ () => { browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/selectCity`); handleContainerClose && handleContainerClose() } }>{ selectedCity.name }</p>
               <Icon className='arrow-down' type='down' />
             </div>
           </div>

           <div className='service'>
             <Flex>
               {
                 serviceInfo.map((item, idx) => {
                   if (idx<3) {

                     return (
                       <ServerItem key={ idx } item={ item } handleSelectServer={ handleSelectServer } handleContainerClose={ handleContainerClose } />
                     )
                   }
                 })
               }
             </Flex>
             <Flex>
                 {
                   serviceInfo.map((item, idx) => {
                     if (idx>=3 && idx<6) {
                       return (
                         <ServerItem key={ idx } item={ item } handleSelectServer={ handleSelectServer } handleContainerClose={ handleContainerClose } />
                       )
                     }
                   })
                 }
             </Flex>
             <Flex>
                 {
                   serviceInfo.map((item, idx) => {
                     if (idx>=6) {
                       return (
                         <ServerItem key={ idx } item={ item } handleSelectServer={ handleSelectServer } handleContainerClose={ handleContainerClose } />
                       )
                     }
                   })
                 }
             </Flex>
           </div>

           <div className='use-tips'>灰色项目暂不支持，我们将尽快开通</div>
         </div>
       )
     } else {
       return (<div></div>)
     }
  }

  const ServerItem = ({ item, handleSelectServer, handleContainerClose }) => (
    <Flex.Item className='server-item' onClick={ () => {
        item.hasServer ? handleSelectServer(item) : ''
        handleContainerClose && handleContainerClose()
    } }>
      <dl>
        <dt>
          <Icon className='service-icon' type={ require(`svg/shenghuojiaofei/${ item.icon }.svg`) } />
        </dt>
        <dd>
          { item.name }
        </dd>
      </dl>
    </Flex.Item>
  )

  export default SelectServer
