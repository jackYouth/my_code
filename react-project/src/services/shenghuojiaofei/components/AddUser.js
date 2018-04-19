import React from 'react'
import { List, WhiteSpace, InputItem, Toast, Icon, Picker } from 'antd-mobile'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { contains } from 'ramda'

import Button from './Button'
import ServerHeader from './ServerHeader'
import '../styles/addUser.scss'

const AddUser = ({ currentServer,
                  currentHomeTag, handleClickHome,
                  currentOrg = '',
                  handleNumChange, handlePwdChange,
                  billNo = '', billPwd = '',
                  handleQueryBill, handleSelectOrg,
                  handleQueryTypeChange, curQueryType, queryTypeUrl,
                  queryTypes,
                  selectedCity,
                  homesStore }) => {
  console.log('queryTypes2222222', queryTypes)
  if (queryTypes.length > 0) {
    const Item = List.Item

    //  当是从用户页直接跳转到该页面时，设置默认使用带过来的参数里的backResv1项作为backResv1，因为两个的currentorg的backResv1对应的键值对不一致
    if (!currentHomeTag) {
      if (getStore('currentHomeTag', 'session')) {
        currentHomeTag = getStore('currentHomeTag', 'session').currentHomeTag
      } else {
        currentHomeTag = currentOrg.tag
      }
    }
    const { orgId, categoryId, backResv1, orgName, validationExp } = currentOrg
    console.log('currentOrg', currentOrg)

    //  设置当前queryTypes
    queryTypes = queryTypes.map(item => ({ label: item.typeName, value: item.type }))
    if (curQueryType) {
      curQueryType = curQueryType[0]
    } else if (queryTypeUrl) {
      curQueryType = queryTypeUrl
    } else {
      curQueryType = queryTypes[0].value
    }
    const curQueryTypeName = Array(queryTypes.filter(item => item.value === curQueryType)[0].label)

    const queryInfo = {
      billNo,
      billPwd,
      orgId,
      categoryId,
      backResv1,
      orgName,
      typeName: curQueryTypeName[0],
      tag:      currentHomeTag,
      type:     curQueryType,
      channel:  'chinaums',
    }

    //  当是从用户页直接跳转到该页面时，currentOrg.backResv1为undefined，使用带过来的currentOrg.backResv1
    if (!queryInfo.backResv1) {
      queryInfo.backResv1 = currentOrg.backResv1
    }

    //  当是从用户页直接跳转到该页面时，currentorg中是带有tag参数的，当没有选择过home时，就使用cuttentorg中的tag作为当前的currentHomeTag
    //  if (getStore('editInfo', 'session')) {
    //    const editInfo = getStore('editInfo', 'session').editInfo
    //    queryInfo.edit = true
    //    queryInfo.bid = bid // 将旧的需要修改的billNo保存到queryInfo中
    //  }

    if (!currentHomeTag) {
      currentHomeTag = '我家'
    }
    queryInfo.tag = currentHomeTag
    queryInfo.billCityId = selectedCity.id
    queryInfo.billCityName = selectedCity.name
    if (!billNo) billNo = ''
    console.log('currentOrg', currentOrg)
    return (
      <div className='addUser'>
        <ServerHeader currentServer={ currentServer } />
        <List className='query-info'>
          <Item className='select-home' extra={ currentHomeTag } arrow='horizontal' onClick={ () =>
              Mask(
                <SlidePage target='right' showClose={ false } >
                  <SelectHome { ...{ handleClickHome, currentHomeTag, homesStore } } />
                </SlidePage>
              , { mask: false, style: { position: 'absolute' } })
            }
          >家庭</Item>
          <WhiteSpace size='md' />

          <Item extra={ currentOrg.orgName } arrow='horizontal' onClick={ () => handleSelectOrg(currentServer, currentOrg, billNo) }>缴费单位</Item>
          {
            queryTypes.length >= 2 &&
            <Picker data={ queryTypes } value={ Array(curQueryType) } title='缴费类型' cols={ 1 } extra={ curQueryTypeName } onChange={ handleQueryTypeChange }>
              <List.Item arrow='horizontal'>缴费类型</List.Item>
            </Picker>
          }
          {
            queryTypes.length <= 1 &&
            <Item extra={ curQueryTypeName[0] }>缴费类型</Item>
          }
          <InputItem
            placeholder={ `请输入${ currentOrg.typeName }` }
            data-seed='logId'
            onChange={ handleNumChange }
            type='number'
            defaultValue={ billNo }
            className='input-num'
          >
            { curQueryTypeName }
          </InputItem>
          {
            currentOrg.needPwd ? (
              <InputItem
                placeholder='请输入密码'
                data-seed='logId'
                onChange={ handlePwdChange }
                type='number'
                className='input-num'
              >
                密码
              </InputItem>) : ''
          }
        </List>
        <WhiteSpace size='lg' />
        <p className='remark'>{ currentOrg.remark }</p>
        <WhiteSpace size='xl' />
        <Button title='下一步' btnStyle={ billNo.length === 0 ? { background: '#ccc' } : {} } handleClick={ () => {
          if (billNo.length !== 0) {
            if (currentOrg.curQueryType === 2) {
              Toast.info('暂不支持条码查询')
              return
            }
            handleQueryBill(queryInfo, validationExp)
          }
        } }
        />
      </div>
    )
  }
  return (<div />)
}

export default AddUser

class SelectHome extends React.Component {
  constructor(props) {
    super(props)
    const { currentHomeTag } = props
    this.state = {
      currentHomeTag,
    }
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleIconClick = this.handleIconClick.bind(this)
  }
  handleSaveClick() {
    const inputValue = this.node.value
    const { homesStore } = this.props
    if (inputValue) {
      if (contains(inputValue)(homesStore)) {
        Toast.fail('已存在此家庭名称，请重新修改', 1)
      } else {
        const { handleClickHome, handleContainerClose } = this.props
        handleClickHome(inputValue)
        handleContainerClose()
      }
    } else {
      Toast.fail('请输入自定义家庭名称', 1)
    }
  }
  handleIconClick(currentHomeTag) {
    this.setState({ currentHomeTag })
  }

  render() {
    const { handleClickHome, handleContainerClose, homesStore } = this.props
    const { currentHomeTag } = this.state
    const homes = ['我家', '父母家', '房东', '朋友', '其它'].filter(item => {
      if (!contains(item)(homesStore) || item === this.props.currentHomeTag) {
        return true
      }
      return false
    })

    //  判断当前选中的是不是其它
    let isOther = false
    if (currentHomeTag !== '我家' && currentHomeTag !== '父母家' && currentHomeTag !== '朋友' && currentHomeTag !== '房东') {
      isOther = true
    }

    let defaultValue = ''
    if (isOther && currentHomeTag !== '其它') defaultValue = currentHomeTag

    return (
      <ul className='home-list'>
        {
          homes.map((item, idx) => (
            <li key={ item } onClick={ () => {
              if (item !== '其它') {
                handleClickHome(item)
                handleContainerClose()
              }
            } }
            >
              <p className='left'>{ item }</p>
              {
                item === '其它' && isOther && <input className='center' type='text' placeholder='自定义家庭名称' defaultValue={ defaultValue } ref={ node => this.node = node } />
              }
              <p className='right'>
                {
                  (item === currentHomeTag || (isOther && idx === 4)) && <Icon className='my-icon' type={ require('svg/shenghuojiaofei/check.svg') } />
                }
                {
                  item !== currentHomeTag && !isOther && <Icon type={ require('svg/shenghuojiaofei/check_no.svg') } onClick={ () => this.handleIconClick(item) } />
                }
              </p>
            </li>
          ))
        }
        <WhiteSpace size='lg' />
        { (currentHomeTag === '其它' || isOther) && <Button title='保存' handleClick={ this.handleSaveClick } /> }
      </ul>
    )
  }
}
