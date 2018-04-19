import React, { Component } from 'react'
import { Icon } from 'antd-mobile'
import { Empty, Search } from '@boluome/oto_saas_web_app_component'
import { getStore, setStore, removeStore } from '@boluome/common-lib'
// import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
// import { CarouselImg } from './picture.js'
import { CinemaItem } from './cinema.js'
import '../style/app.scss'


const Searchcin = searchcin => {
  console.log('aaaaaaaa======>', searchcin)
  const { myKey, data, dataList, goSelect, handleFilter } = searchcin
  const search = (searchKey, cb) => {
    if (searchKey) {
      handleFilter(data, searchKey, cb)
    } else {
      cb('searchKey is undefined')
    }
  }
  return (
    <div>
      <Search
        inputPlaceholder={ '请输入搜索内容' }
        listItem={ <CinemaItem /> }
        noResult={ <Empty message='没有找到合适的影院呢~' imgUrl={ <Icon type={ require('svg/dianying/cinemaImg.svg') } /> } /> }
        myKey={ myKey }
        dataList={ dataList }
        onFeach={ search }
        content={ <Serhistory /> }
        rightComponent={ <Cancel /> }
        handleResult={ result => { goSelect(result.id) } }
      />
    </div>
  )
}

// 取消组件
const Cancel = () => {
  const handleContainerClose = () => {
    window.history.go(-1)
  }
  return (
    <span className='cancel' onClick={ () => handleContainerClose() }>取消</span>
  )
}

// 搜索历史组件
class Serhistory extends Component {
  constructor(props) {
    super(props)
    const arr = getStore('dianying_History') || []
    this.state = { arr }
  }

  handleClearhistory() {
    removeStore('dianying_History')
    this.setState({ arr: [] })
  }

  handleClearonehistory(kk) {
    const dianyingHistory = getStore('dianying_History')
    let num = 0
    dianyingHistory.map((o, i) => {
      if (o === kk) num = i
      return o
    })
    dianyingHistory.splice(num, 1)
    setStore('dianying_History', dianyingHistory)

    this.setState({ arr: dianyingHistory })
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
                  <Icon onClick={ () => this.handleClearonehistory(o) } type={ require('svg/dianying/cha.svg') } />
                </p>
              )
            })
          }
          <p onClick={ () => this.handleClearhistory() }>
            <Icon type={ require('svg/dianying/delete.svg') } />清除历史记录
          </p>
        </div>
      )
    }
    return (
      <div />
    )
  }
}

export default Searchcin
