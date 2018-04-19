import React from 'react'
import { getStore, removeStore } from '@boluome/common-lib'
import { Search, Empty } from '@boluome/oto_saas_web_app_component'
import { forceCheck } from 'react-lazyload'
import { Modal } from 'antd-mobile'
// import { browserHistory } from 'react-router'
import ListItem from './listItem'
import img from '../img/notfound.png'
import del from '../img/del.png'
import '../style/search.scss'

const SearchPage = props => {
  const { myKey = '', setSearchKey, search, searchList = [], isFromRestDetail, handleScrollTop } = props
  console.log('props--------->', props)

  return (
    <div className='search-container'>
      <Search
        inputPlaceholder={ '请输入商家、商品名称' }
        listItem={ <ListItem handleScrollTop={ handleScrollTop } /> }
        noResult={ <Empty message='未搜索到相关信息' imgUrl={ img } /> }
        onFeach={ search }
        handleResult={ setSearchKey }
        onScroll={ forceCheck }
        delayTime={ 500 }
        content={ <Content setSearchKey={ setSearchKey } /> }
        myKey={ myKey }
        dataList={ isFromRestDetail ? searchList : [] }
      />
    </div>
  )
}

export default SearchPage

// const Cancel = props => {
//   const { handleContainerClose } = props
//   return (
//     <span className='cancel' onClick={ () => handleContainerClose() }>取消</span>
//   )
// }

// 默认显示于搜索框下的内容，此处实例为历史记录
const Content = props => {
  const { setSearchKey } = props
  const alert = Modal.alert
  let searchHistory = getStore('searchHistory') || []
  searchHistory = searchHistory.reverse()
  if (searchHistory.length > 10) {
    searchHistory.length = 10
  }
  // 清除历史记录
  const cleanHistory = () => {
    removeStore('searchHistory')
    document.querySelector('#history').style.display = 'none'
  }

  return (
    <div>
      {
        searchHistory && searchHistory.length > 0 ?
          <div className='history' id='history'>
            <div className='title'>
              <span>历史记录</span>
              <img src={ del } alt='历史记录' onClick={ () => alert('', '确认删除全部历史记录?', [
                { text: '取消', onPress: () => console.log('cancel') },
                { text: '删除', onPress: () => cleanHistory(), style: { fontWeight: 'bold' } },
              ]) }
              />
            </div>
            <ul>
              {
                searchHistory.map(item => (
                  <li key={ `search-${ item }` } onClick={ () => { setSearchKey(item) } }>
                    { item }
                  </li>
                ))
              }
            </ul>
          </div>
        : ''
      }
    </div>
  )
}
