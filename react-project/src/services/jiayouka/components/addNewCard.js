import { Toast } from 'antd-mobile'
import React from 'react'
import { getStore } from '@boluome/common-lib'
import { get, send } from 'business'
import { merge } from 'ramda'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import './css/addNewCard.scss'

class AddNewCard extends React.Component {
  constructor(props) {
    super(props)
    const { id } = this.props.location.query
    // console.log('query=======',this.props.location.query.id);
    this.edit = false
    if (id) {
      const { cardsList } = this.props.GetCardsList
      console.log('chooseId========', id)
      // console.log('cardsList========',cardsList);
      let editContact = {}
      if (id) {
        for (let i = 0; i < cardsList.length; i++) {
          if (cardsList[i].id === id) {
            editContact = cardsList[i]
          }
        }
      }

      this.state = {
        ...editContact,
        showBasisNameList: ['autohome', 'pingan-one', 'localhost'],
      }
      this.edit = true
    } else {
      this.state = {
        id:                '',
        cardId:            '',
        userName:          '',
        credentialNum:     '',
        phone:             '',
        showBasisNameList: ['autohome', 'pingan-one', 'localhost'],
      }
    }
  }

  componentWillMount() {
    const { showBasisNameList = [] } = this.state
    const currHost = location.hostname.split('.')[0]
    let isShowBasis
    const newArr = showBasisNameList.filter(i => {
      return i === currHost
    })
    if (newArr.length > 0) {
      isShowBasis = true
    } else {
      isShowBasis = false
    }
    this.setState({ isShowBasis })
    // console.log('showBasisNameList', showBasisNameList, currHost, isShowBasis)
  }

  handleCardIdChange(cardId) {
    this.setState({ cardId })
    // if (getStore('categoryId', 'session') === 1) {
      // if (cardId.length === 19) {
      //   // console.log('ZSHcardId============',cardId);
      //   // this.fetchUserName(cardId)
      // }
    // } else {
      // if (cardId.length === 16) {
      //   // console.log('ZSYcardId============',cardId);
      //   // this.fetchUserName(cardId)
      // }
    // }
  }

  fetchUserName(cardId) {
    const handleClose = Loading()
    let urls = '/jiayouka/v1/:categoryId/cards/:cardId/name'
    urls = urls.replace(/:categoryId/g, getStore('categoryId', 'session'))
    urls = urls.replace(/:cardId/g, cardId)
    get(urls)
    .then(({ code, data, message }) => {
      if (code === 0) {
        this.state.userName = data.userName
        document.getElementsByClassName('userName')[0].value = this.state.userName
      } else {
        Toast.info(message)
      }
      handleClose()
    })
  }

  handleNameChange(userName) {
    this.setState({ userName })
  }
  handleIdNumChange(credentialNum) {
    this.setState({ credentialNum })
  }
  handlePhoneChange(phone) {
    this.setState({ phone })
  }

  handleSaveContact() {
    const { id, cardId, phone } = this.state
    // const { onSuccess } = this.props
    if (!cardId) {
      Toast.info('请输入加油卡号')
      return
    }
    // if (!userName) {
    //   Toast.info('请输入持卡人姓名')
    //   return
    // }
    // if (!credentialNum) {
    //   Toast.info('请输入持卡人证件号')
    //   return
    // }
    if (!phone) {
      Toast.info('请输入手机号码')
      return
    }

    let postData = {}
    if (id) {
      postData = merge(this.state, {
        customerUserId: sessionStorage.customerUserId,
      })
    } else {
      postData = merge(this.state, {
        customerUserId: sessionStorage.customerUserId,
        credentialType: '身份证',
        categoryId:     getStore('categoryId', 'session').toString(),
      })
    }


    const handleClose = Loading()
    send('/jiayouka/v1/cards', postData, 'post')
    .then(({ code, message }) => {
      if (code === 0) {
        window.history.go(-1)
      } else {
        Toast.info(message)
      }
      handleClose()
    })
  }

  render() {
    const { cardId, userName, credentialNum, phone, isShowBasis } = this.state
    const categoryId = Number(getStore('categoryId', 'session'))
    // console.log('categoryId', categoryId)
    return (
      <div className='cardInforContainer'>
        <div className='userInfoList'>
          <ul>
            <li>
              <span>加油卡号</span>
              <input type='tel' placeholder='请输入加油卡号' value={ cardId } maxLength={ categoryId === 1 ? '19' : '16' } onChange={ e => this.handleCardIdChange(e.target.value) } />
            </li>
            {
              isShowBasis ?
                <li>
                  <span>姓名</span>
                  <input type='text' className='userName' placeholder='持卡人姓名' value={ userName } onChange={ e => this.handleNameChange(e.target.value) } />
                </li>
              : ''
            }
            {
              isShowBasis ?
                <li>
                  <span>证件类型</span>
                  <input type='text' value='身份证' readOnly='readOnly' />
                </li>
              : ''
            }
            {
              isShowBasis ?
                <li>
                  <span>证件号码</span>
                  <input type='text' placeholder='持卡人证件号' maxLength='18' value={ credentialNum } onChange={ e => this.handleIdNumChange(e.target.value) } />
                </li>
              : ''
            }
            <li>
              <span>手机号码</span>
              <input type='tel' placeholder='短信通知号码' maxLength='11' value={ phone } onChange={ e => this.handlePhoneChange(e.target.value) } />
            </li>
          </ul>
        </div>
        <p style={{ color: '#ff4848', fontSize: '.28rem', padding: '.2rem .3rem' }}>*请仔细检查加油卡卡号，确认无误后再保存</p>
        <div className='button'>
          <button onClick={ () => this.handleSaveContact() } style={{ fontSize: '.32rem' }}>保存</button>
        </div>
      </div>
    )
  }
}

export default AddNewCard
