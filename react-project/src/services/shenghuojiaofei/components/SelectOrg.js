import React from 'react'
import { Icon } from 'antd-mobile'

import '../styles/selectOrg.scss'

const SelectOrg = ({
  searchOrgResults, handleSearch, handleSelectOrg, selectedCity, currentOrg, isIndex, handleSelectCity,
}) => {
  let currentOrgId = ''
  if (currentOrg) {
    currentOrgId = currentOrg.orgId
  } else if (searchOrgResults[0]) {
    currentOrgId = searchOrgResults[0].orgId
  }
  console.log(909090900909)
  return (
    <div className='selectOrg'>
      <div className='org-header'>
        <div className='city-select' onClick={ () => handleSelectCity(isIndex) }>
          <p>{ selectedCity.name }</p>
          <Icon className='icon-arrow' type='down' />
        </div>
        <div className='org-search'>
          <Icon className='icon-search' type='search' size='md' />
          <input id='inputSearch' type='text' placeholder='搜索出账机构' onBlur={ e => handleSearch(e.target.value) } />
        </div>
      </div>
      {
        searchOrgResults !== '' && (
          <ul className='orgs-list'>
            {
              searchOrgResults.map(item => {
                return (
                  <li key={ item.orgId } onClick={ () => handleSelectOrg(item) }>
                    { item.orgName }
                    { currentOrgId === item.orgId && <Icon className='selected-icon' size='sm' type={ require('svg/shenghuojiaofei/checked_nobg.svg') } /> }
                  </li>
                )
              })
            }
          </ul>
        )
      }
      {
        searchOrgResults.length === 0 && searchOrgResults !== '' && <p className='no-result' style={{ color: '#888', paddingTop: '.2rem', textAlign: 'center' }}>未找到相关信息</p>
      }
      {
        searchOrgResults === '' && (<div className='no-support'><img alt='暂不支持该城市' src={ require('../img/no_support.png') } /><p>所选城市暂不支持该服务</p></div>)
      }
    </div>)
}


export default SelectOrg
