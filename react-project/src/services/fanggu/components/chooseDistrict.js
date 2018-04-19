import '../style/chooseDistrict.scss'
import { List, Toast, Modal } from 'antd-mobile'
import React from 'react';
import { get, getStore, setStore} from '@boluome/common-lib';
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'

const alert = Modal.alert;

let searchKey = ''

const chooseDistrict = (props) => {

  const { feachDistrict , confirmDistrict } = props
  const { districtList = [] } = props

  let cleanHistory = () => {
    setStore('searchHistory', '' ,'session')
    // Toast.info('clean',1)
    document.querySelector('#history').style.display = 'none'
  }

  let searchHistory
  if(getStore('searchHistory' , 'session') && getStore('searchHistory' , 'session').length > 0){
    searchHistory = getStore('searchHistory' , 'session').reverse()
  } else {
    searchHistory = []
  }

  let box
  let searchInput = document.querySelector('#searchInput') ? document.querySelector('#searchInput').value : ''

  // let key
  //
  // let getVal = (val) =>{
  //
  // }

  if(searchInput){
    // const nameArr = residentialareaName.split(searchKey)
    // o.residentialareaName = (
    //   <span>
    //     { nameArr[0] }
    //     <span style={{ color: '#ff9a00' }}> { key } </span>
    //     { nameArr[1] }
    //   </span>
    // )
    // {
    //   [
    //     <span>{ residentialareaName.split(searchKey)[0] }</span>,
    //     <span style={{ color: '#ff9a00' }}>{ searchKey }</span>,
    //     <span>{ residentialareaName.split(searchKey)[1] }</span>
    //   ]
    // }
    if (districtList.length > 0){
      box =  <div className='districtList'>
              <ul>
                {
                  districtList.map(({ address , residentialareaName } , index) => (
                    <li key={ `arr-${ index }` } onClick={ () => { confirmDistrict(residentialareaName,address) ; browserHistory.push('/fanggu/') } } >
                      <div className='districtContainer'>
                        <h2 ref={ node => {
                          if(node) {
                            node.innerHTML = residentialareaName.replace(new RegExp(searchKey, "g"), `<span style='color: #ff9a00'>${ searchKey }</span>`)
                          }
                        }}></h2>
                        <p>{ address }</p>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>
    } else {
      box = <div className='notFound'>未找到该小区</div>
    }
  } else {
    if( searchHistory && searchHistory.length > 0 ){
      box = <div className='history' id='history'>
              <div className='title'>搜索记录</div>
              <ul>
                {
                  searchHistory.map((item, index) => (
                    <li key={ `search-${ index }` } onClick={ () => { confirmDistrict(item) ; browserHistory.push('/fanggu/') } }>
                      <p>{ item }</p>
                    </li>
                  ))
                }
              </ul>
              <div className='deleteHistory' onClick={() => alert('删除', '确定删除么???', [
                { text: '取消', onPress: () => console.log('cancel') },
                { text: '确定', onPress: () => cleanHistory(), style: { fontWeight: 'bold' } },
              ])}>清空搜索记录</div>
            </div>
    } else {
      box = ''
    }
  }

    return (
      <div>
        <div className='searchBar'>
          <div>
            <input id='searchInput' type='text' placeholder='请输入小区名称' onChange={ ( e ) => { feachDistrict(e.target.value); searchKey = e.target.value;  }} />
          </div>
          <span className='cancel' onClick={ () => browserHistory.push('/fanggu/') }>取消</span>
        </div>
        { box }
      </div>
    )
}



export default chooseDistrict
