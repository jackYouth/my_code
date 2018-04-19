import React, { Component } from 'react'
import { getStore, setStore, removeStore, parseLocName } from '@boluome/common-lib'
import { UserCenter, Mask, Search, SlidePage, CitySearch, Supplier, Listview, Empty } from '@boluome/oto_saas_web_app_component'
import { Icon } from 'antd-mobile'
import SelectTab from './selectTab'
import '../style/app.scss'
import noticket from '../img/noticket.png'

const App = app => {
  const { offset, cityName, cityArr, categoryArr, channel, filtered, filtering, handleChannel, addfun, goDetail } = app
  console.log(app)
  return (
    <div className='app'>
      <UserCenter categoryCode='piaowu' orderTypes='piaowu' />
      <Supplier categoryCode='piaowu' onChange={ result => handleChannel(result, cityArr, categoryArr, channel, cityName) } />
      <SearchTitle app={ app } />
      <Seltab app={ app } />
      <div className='tabs' ref={ node => { if (node) { node.style.height = window.getComputedStyle(node).height } } }>
        { filtering && <SelectTab { ...app } /> }
        <Listview
          listItem={ <Listviewli onClick={ e => goDetail(e) } /> }
          onFetch={ addfun }
          limit={ 20 }
          offset={ offset }
          fetchData={ filtered }
        />
      </div>
    </div>
  )
}

const Seltab = ({ app }) => {
  const { filterdata, filtered, filtering, handlePush } = app
  const categoryCodearr = filterdata.categoryCode.filter(o => o.code === filtered.categoryCode)
  const sortarr = filterdata.sort.filter(o => o.code === filtered.sort)
  const timeRangearr = filterdata.timeRange.filter(o => o.code === filtered.timeRange)
  return (
    <div className='themeWrap'>
      <span style={ categoryCodearr[0].code ? { color: '#ffab00' } : {} } onClick={ () => handlePush(filtering, 'categoryCode') }>
        { categoryCodearr[0].text }
        <Icon style={ filtering === 'categoryCode' ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' } } type={ categoryCodearr[0].code ? require('svg/piaowu/arrowdowning.svg') : require('svg/piaowu/arrowdown.svg') } />
      </span>
      <span style={ sortarr[0].code ? { color: '#ffab00' } : {} } onClick={ () => handlePush(filtering, 'sort') }>
        { sortarr[0].text }
        <Icon style={ filtering === 'sort' ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' } } type={ sortarr[0].code ? require('svg/piaowu/arrowdowning.svg') : require('svg/piaowu/arrowdown.svg') } />
      </span>
      <span style={ timeRangearr[0].code ? { color: '#ffab00' } : {} } onClick={ () => handlePush(filtering, 'timeRange') }>
        { timeRangearr[0].text }
        <Icon style={ filtering === 'timeRange' ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' } } type={ timeRangearr[0].code ? require('svg/piaowu/arrowdowning.svg') : require('svg/piaowu/arrowdown.svg') } />
      </span>
    </div>
  )
}

const Listviewli = ({ data, onClick }) => {
  const { lowPrice, begin, end, name, imgUrlv, venuesName, status } = data
  return (
    <div className='contentBox' onClick={ () => { if (onClick) onClick(data.code) } }>
      <div className='contentinner'>
        <div className='contentImgBox'>
          <img alt='票务' src={ imgUrlv } />
        </div>
        <div className='contentMain'>
          <h2>{ name }</h2>
          <div className='context'>
            <p>{ begin === end ? begin : `${ begin } - ${ end }` }</p>
            <p>{ venuesName }</p>
          </div>
          <div className='price'>
            <span
              className='status'
              style={ status ? {} : { color: '#ffa600', border: '1px solid #ffa600' } }
            >{ status ? '预售' : '售票中' }</span>
            <span className='qi'>起</span>
            <span className='money'>¥{ lowPrice }</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 取消组件
const Cancel = props => {
  const { handleContainerClose } = props
  return (
    <span className='cancel' onClick={ () => handleContainerClose() }>取消</span>
  )
}

// 搜索列表组件
const Searchlist = props => {
  const { data, searchKey } = props
  const { fullName } = data
  const arr = fullName.split(searchKey)
  const clicklist = () => {
    const piaowuHistory = getStore('piaowu_History') || []
    if (!piaowuHistory.some(o => o === searchKey)) piaowuHistory.push(searchKey)
    setStore('piaowu_History', piaowuHistory)
  }
  return (
    <div className='searchliBox' onClick={ () => { clicklist() } }>
      <p dangerouslySetInnerHTML={{ __html: arr.join(`<i>${ searchKey }</i>`) }} />
    </div>
  )
}

// 搜索历史组件
class Serhistory extends Component {
  constructor(props) {
    super(props)
    const arr = getStore('piaowu_History') || []
    this.state = { arr }
  }

  handleClearhistory() {
    removeStore('piaowu_History')
    this.setState({ arr: [] })
  }

  handleClearonehistory(kk) {
    const piaowuHistory = getStore('piaowu_History')
    let num = 0
    piaowuHistory.map((o, i) => {
      if (o === kk) num = i
      return o
    })
    piaowuHistory.splice(num, 1)
    setStore('piaowu_History', piaowuHistory)

    this.setState({ arr: piaowuHistory })
  }

  render() {
    console.log(this.props)
    const { onKeywordChange } = this.props
    const { arr } = this.state
    if (arr.length > 0) {
      return (
        <div className='serhistory'>
          <p>历史记录</p>
          {
            arr.length > 0 && arr.map(o => {
              return (
                <p key={ Math.random() }>
                  <span onClick={ () => onKeywordChange(o) }>{ o }</span>
                  <Icon onClick={ () => this.handleClearonehistory(o) } type={ require('svg/piaowu/cha.svg') } />
                </p>
              )
            })
          }
          <p onClick={ () => this.handleClearhistory() }>
            <Icon type={ require('svg/piaowu/delete.svg') } />清除历史记录
          </p>
        </div>
      )
    }
    return (
      <div />
    )
  }
}

// 顶部搜索组件
const SearchTitle = ({ app }) => {
  const { filtering, cityArr, categoryArr, cityName, filtered, handleSelct, handlePush, search, goDetail } = app
  return (
    <div className='searchTitle'>
      <span onClick={ () => {
        handlePush(filtering, filtering)
        Mask(
          <SlidePage target='right' showClose={ false } >
            <CitySearch
              localCity={ getStore('currentPosition', 'session') ? parseLocName(getStore('currentPosition', 'session').city) : cityName }
              categoryCode='piaowu'
              handleCityData={ result => { handleSelct(cityArr, categoryArr, result.name, filtered) } }
              api={ cityArr[getStore('piaowu_channel', 'session')] }
            />
          </SlidePage>, { mask: false, style: { position: 'absolute' } })
      } }
      >
        { cityName }
        <Icon type={ require('svg/piaowu/arrowdownall.svg') } />
      </span>
      <form className='search' onClick={ () => {
        handlePush(filtering, filtering)
        Mask(
          <SlidePage target='right' showClose={ false }>
            <Search
              inputPlaceholder={ '请输入搜索内容' }
              listItem={ <Searchlist /> }
              noResult={ <Empty message='没有找到相关演出~' imgUrl={ noticket } /> }
              onFeach={ search }
              rightComponent={ <Cancel /> }
              content={ <Serhistory /> }
              handleResult={ result => { goDetail(result.code) } }
            />
          </SlidePage>, { mask: false })
      } }
      >
        <Icon type={ require('svg/piaowu/sousuo.svg') } />
        <span className='input'>搜索明星、演唱会、场馆</span>
      </form>
    </div>
  )
}

export default App
