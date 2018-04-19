import React from 'react'
import { setStore } from '@boluome/common-lib'
import { WhiteSpace, List, Icon } from 'antd-mobile'
import { UserCenter, Mask, SlidePage, CitySearch, PayTips } from '@boluome/oto_saas_web_app_component'
import { merge, contains } from 'ramda'

import SelectOrg from '../containers/SelectOrg'
import '../styles/app.scss'

const App = ({
  selectedCity, handleSelectCity,
  service,
  userCategory, handleChangeHome, currentHomeTag,
  handleToBill, handleNewEdit, handleNewDel, handleToSelectOrgs,
  serviceStyle = '100%',
  currentServer = { categoryName: '' },
  handleEditClick, isEdit,
  handleHomeManegeClick, handleClickNewIcon,
  currentServerCategoryId,
  getCurrentServer,
}) => {
  if (service && service.length > 0 && currentServer.categoryName !== '') {
    const homes = []
    if (userCategory) {
      userCategory.forEach(item => {
        const o = {
          tag:  item.tag,
          name: item.cityName,
          id:   item.cityId,
        }
        homes.push(o)
      })
    }
    setStore('homes', { homes }, 'session')
    const { categoryName } = currentServer
    if (homes.length !== 0 || categoryName === 'all') {
      return (
        <div className='user-page single-category'>
          <CommonComponent categoryName={ categoryName } />
          <MyHome
            { ...{ userCategory, handleSelectCity, handleChangeHome, currentHomeTag, selectedCity, service, handleToBill, handleNewEdit, handleNewDel, handleToSelectOrgs, serviceStyle, handleEditClick, isEdit, handleHomeManegeClick, handleClickNewIcon, currentServer, currentServerCategoryId, homes, getCurrentServer, categoryName } }
          />
          <PayTips title='生活缴费' content={ <Content /> } />
        </div>
      )
    }
    setStore('newUserPage', 'newUserPage', 'session')     // 保存一个参数到本地，表示是从app页面跳转过去的
    // setStore('getOrgsPara', { getOrgsPara: { cityId: selectedCity.id, categoryId: currentServerCategoryId, channel: 'chinaums' } }, 'session')
    return (
      <div>
        <CommonComponent categoryName={ categoryName } />
        <SelectOrg isIndex='true' />
      </div>
    )
  }
  return (<div />)
}

const CommonComponent = ({ categoryName }) => (
  <div>
    <UserCenter categoryCode={ categoryName === 'all' ? 'shenghuojiaofei' : categoryName } />
  </div>
)

const Content = () => (
  <div>
    <h5>缴费操作步骤</h5>
    <p>
      1）选择缴费城市与缴费类型；<br />
      2）新增缴费账号后，可以查到该账号是否有未缴费账单；<br />
      3）查询到欠费金额后，点击“确认缴费”；<br />
      4）选择支付方式，确认支付即可。
    </p>
    <h5>缴费金额限制</h5>
    <p>系统会根据您的使用环境及历史交易情况综合判定并随时调整您的单笔/日/月充值次数及金额，如果发生缴费失败的情况，请联系酷屏的客服咨询具体原因。联系电话<a style={{ fontSize: '.24rem', color: '#666' }} href='tel:4009910008'>4009910008</a>.</p>
    <h5>是否可以代缴其他城市的费用</h5>
    <p>可以。</p>
    <h5>缴费失败后，退款多久能到账</h5>
    <p>以银行到账时间为准。</p>
    <h5>缴费需要手续费吗</h5>
    <p>不需要。</p>
    <h5>非注册用户可以使用水电煤缴费功能吗</h5>
    <p>不可以，该功能仅支持注册用户使用。</p>
  </div>
)

const MyHome = ({
  userCategory, handleSelectCity, handleChangeHome, currentHomeTag,
  selectedCity = { id: '', name: '' }, service = [],
  handleToBill, handleNewEdit, handleNewDel, handleToSelectOrgs,
  handleEditClick, isEdit = true,
  handleHomeManegeClick, handleClickNewIcon,
  currentServerCategoryId,
  currentServer,
  homes,
  getCurrentServer,
  categoryName,
}) => {
  const Item = List.Item
  // 定义一个变量isAllFirst，判断是否是全品类时，第一次进入该页面
  const isAllFirst = userCategory.length === 0
  if (isAllFirst) setStore('newUserPage', 'newUserPage', 'session')     // 如果是是全品类时，第一次进入该页面，保存一个参数到本地，表示是从app页面跳转过去的
  const nameStyle = {
    lineHeight:   '.32rem',
    fontSize:     '.32rem',
    color:        '#111111',
    marginBottom: '.15rem',
  }
  const noAddressStyle = {
    lineHeight:   '.32rem',
    fontSize:     '.32rem',
    color:        '#111111',
    marginBottom: '.15rem',
    marginTop:    '.15rem',
  }
  const nameNoStyle = {
    lineHeight: '.32rem',
    fontSize:   '.32rem',
    color:      '#111111',
  }
  const NoStyle = {
    fontSize:   '.24rem',
    lineHeight: '.24rem',
    color:      '#999999',
  }

  // 定义一个变量，用来保存当前家庭类型
  currentHomeTag = currentHomeTag || (homes[0] && homes[0].tag)
  setStore('currentHomeTag', { currentHomeTag }, 'session')
  // 获取当前家庭信息，默认值为：{ cityName: selectedCity.name, cityId: selectedCity.id, tag: currentHomeTag, tagInfo: [{ name: currentServer.name, categoryId: currentServerCategoryId }] }
  let currentHome = { cityName: selectedCity.name, cityId: selectedCity.id, tag: currentHomeTag, tagInfo: [{ name: currentServer.name, categoryId: currentServerCategoryId }] }
  if (userCategory && userCategory.length > 0) {
    currentHome = userCategory.filter(item => item.tag === currentHomeTag)[0]
    // currentHome = userCategory[0]
  }
  const { cityId, cityName, address, tid, tag } = currentHome
  // 定义一个变量 tagInfo，用来保存当前账单列表
  let { tagInfo } = currentHome
  // 使tagInfo改变时，并不会使userPage中对应的tagInfo改变
  tagInfo = JSON.parse(JSON.stringify(tagInfo))

  // 设置默认的currentBillInfo，因为只有删除，编辑用户地址时，才会用的默认的，所以只需要默认保存cityId, cityName, address, tid, tag
  const defaultBillInfo = { cityId, cityName, address, tid, tag }
  setStore('currentBillInfo', { currentBillInfo: defaultBillInfo }, 'session')
  // 以下是设置当为全品类时，需要遍历出的账单列表
  const categories = []       // 定义当前家庭下，保存的服务，保留下categoryId去区分
  tagInfo.forEach(item => {
    categories.push(item.categoryId)
  })

  const totalCategoryId = []  // 定义当前城市下，支持的服务，保留下categoryId去区分
  service.forEach(item => {
    if (item.isLive === '1') {
      totalCategoryId.push({ categoryId: item.categoryId })
    }
  })
  totalCategoryId.forEach(item => {     // 从当前用户中保存的账单中，把当前城市支持，但没有的服务，添加上去。（注：当前城市不支持的服务，是不可能保存下来的）
    if (!contains(item.categoryId)(categories)) {
      tagInfo.push(item)
    }
  })

  // 如果是全品类第一次，就把当前城市支持的服务，设置为默认显示的账单列表，因为只有categoryId，所以都是可添加的形式
  if (isAllFirst) {
    tagInfo = totalCategoryId
  }
  if (tagInfo.length === 0) {
    return (
      <div>
        <UserCenter categoryCode={ categoryName === 'all' ? 'shenghuojiaofei' : categoryName } />
        { location.pathname.indexOf('shjf') < 0 && <SelectOrg /> }
      </div>
    )
  }

  if (currentServerCategoryId !== '') { // 不是全品类, 使tagInfo只包含当前的账单
    tagInfo = tagInfo.filter(item => item.categoryId === currentServerCategoryId)
    if (tagInfo.length === 0) {
      tagInfo.push({ categoryId: currentServerCategoryId, noSupport: true })
    }
  }

  return (
    <div className='my-home'>
      <WhiteSpace size='md' />
      {
        isAllFirst &&
        <div className='city-select' onClick={ () => Mask(
          <SlidePage target='right' showClose={ false } >
            <CitySearch localCity={ selectedCity.name } categoryCode='shenghuojiaofei' handleCityData={ handleSelectCity } api={ '/shenghuojiaofei/v1/chinaums/citys' } />
          </SlidePage>
          ) }
        >
          <div className='container'>
            <Icon className='icon-location' type={ require('svg/shenghuojiaofei/location.svg') } />
            <p>{ selectedCity.name }</p>
            <Icon className='icon-arrow' type='down' size='xs' />
          </div>
        </div>
      }
      {
        !isAllFirst &&
        <ul className='home-container'>
          { homes.length < 5 && <Icon className='user-icon' type={ require('svg/shenghuojiaofei/user.svg') } size='md' onClick={ () => handleClickNewIcon(currentHomeTag, currentHome, userCategory, selectedCity) } /> }
          {
            homes.map(item => (<li className={ item.tag === currentHomeTag ? 'active' : '' } key={ item.tag + item.id } onClick={ () => handleChangeHome(item) } >{ item.tag }</li>))
          }
        </ul>
      }
      <List>
        {
          !isAllFirst &&
          <Item arrow='horizontal' className='home-info' onClick={ () => handleHomeManegeClick(currentHomeTag, currentHome, userCategory) }>
            <dl className='second-page-dl'>
              <dt>
                <Icon type={ require('svg/shenghuojiaofei/home.svg') } />
              </dt>
              <dd className='first-dd'>
                <p style={ address ? nameStyle : noAddressStyle }>{ cityName }</p>
                <p className='address' style={ NoStyle }>{ address || '' }</p>
              </dd>
            </dl>
          </Item>
        }
        <WhiteSpace size='md' />
        <div className='header'>
          <p className='left'>缴费账户</p>
          { tagInfo[0] && tagInfo[0].bid && <p className='right' onClick={ () => handleEditClick(isEdit) }>{ isEdit ? '编辑' : '取消编辑' }</p> }
        </div>
        {
          (currentHomeTag || isAllFirst) && tagInfo.map(item => {
            let { billCityId, billCityName } = item
            const { billNo, orgName, categoryId, noSupport } = item
            // 是否可添加的文字
            let billText = ''
            if (!billNo) {
              billText = '可添加'
              if (noSupport) billText = '暂不支持'
            }
            if (!billCityId) {
              billCityId = selectedCity.id
              billCityName = selectedCity.name
            }
            // const cateREG = new RegExp(currentServerCategoryId)
            const currentBillInfo = merge(item, defaultBillInfo)
            //  定义传输数据
            const getOrgsPara = { cityId: billCityId, categoryId, channel: 'chinaums', name: billCityName }
            // if (cateREG.test(categoryId)) {    // 此过滤方式，如果为全品类情况，此时的currentServerCategoryId为空，可以匹配所有的categoryId
            const tServer = getCurrentServer(selectedCity.id, categoryId)     // 根据当前选择的categoryId，重新设置tServer，解决全品类情况下，tServer为默认的情况
            return (
              <div key={ `${ categoryId }${ billNo }` }>
                {
                  billNo && <ul className='edit-bill' style={ isEdit ? { display: 'none' } : {} }>
                    <li className='edit' onClick={ () => handleNewEdit(tServer, currentBillInfo) }>修改</li>
                    <li className='del' onClick={ () => handleNewDel(currentBillInfo) }>删除</li>
                  </ul>
                }
                <Item extra={ billText } arrow='horizontal' onClick={ () => {
                  if (billNo) {
                    handleToBill(tServer, currentBillInfo)
                  } else {
                    handleToSelectOrgs(getOrgsPara, tServer, currentBillInfo)
                  }
                } }
                >
                  <dl className='second-page-dl'>
                    <dt><Icon type={ tServer.icon } /></dt>
                    <dd className='first-dd'>
                      { orgName && (<div><p style={ nameStyle }>{ tServer.name }</p><p style={ NoStyle }>{ `${ orgName }(${ billNo })` }</p></div>) }
                      { !orgName && <p style={ nameNoStyle }>{ tServer.name }</p> }
                    </dd>
                  </dl>
                </Item>
              </div>
            )
          })
        }
      </List>
    </div>
  )
}

export default App
