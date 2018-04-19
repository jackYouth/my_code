// import { browserHistory } from 'react-router'
import React, { Component } from 'react'
import { setStore } from '@boluome/common-lib'
import { Loading }   from '@boluome/oto_saas_web_app_component'
// import { Modal } from 'antd-mobile'
import { get } from 'business'

import '../style/carDetails.scss'

class CarDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      brandId: this.props.brandId,
      brandIcon: this.props.brandIcon,
      brandName: this.props.brandName,
      isShow: false,
    }
  }

  // 选中品牌
  handleChooseId() {
    const handleClose = Loading()
    const brandId = this.state.brandId
    get('/chegu/v1/car/series', { brandId })
    .then(({ code, data = {}, message }) => {
      if (code === 0) {
        this.setState({ series: data })
        // console.log('---test-111--', data)
      } else {
        console.log(message)
      }
      handleClose()
    }).catch(err => {
      handleClose()
      console.log(err)
    })
  }

  // 选中车系
  handleSeriesId(seriesId, seriesName) {
    const { chooseSeriesId, brandIcon } = this.state
    if (chooseSeriesId !== seriesId) {
      const handleClose = Loading()
      this.setState({
        chooseSeriesId: seriesId,
        seriesName,
      })
      const seriesIds = seriesId.toString()
      get('/chegu/v1/car/model', { seriesId: seriesIds })
      .then(({ code, data = {}, message }) => {
        setStore('qiche_chegu_brandIcon', brandIcon, 'session')
        if (code === 0) {
          this.setState({
            seriesInfoData:   data,
            isShow:           true,
            secondItem:       '',
            firshFilterList:  '',
            secondFilterList: '',
          })
          console.log('----test-222-', seriesName)
        } else {
          console.log(message)
        }
        handleClose()
      }).catch(err => {
        handleClose()
        console.log(err)
      })
    } else {
      this.setState({ isShow: false })
      this.setState({ chooseSeriesId: '' })
    }
  }

  // 筛选手自动档
  handlefilterFirst(val) {
    this.setState({ firstItem: val }, () => this.handleFilter())
  }
  // 筛选排量
  handlefilterSecond(val) {
    this.setState({ secondItem: val }, () => this.handleFilter())
  }
  handleFilter() {
    const { modelList } = this.state.seriesInfoData
    const { firstItem, secondItem } = this.state
    let newArr = []
    if (firstItem && secondItem) {
      newArr = modelList.filter(item => { return item.gearType === firstItem && item.displacement === secondItem })
    } else if (secondItem) {
      newArr = modelList.filter(item => { return item.displacement === secondItem })
    } else if (firstItem) {
      newArr = modelList.filter(item => { return item.gearType === firstItem })
    }
    this.setState({ firshFilterList: newArr })
  }
  // 选中车型
  handleChooseCar(item) {
    const { brandName, seriesName } = this.state
    setStore('qiche_chegu_chexi', brandName, 'session')
    setStore('qiche_chegu_chexing', seriesName, 'session')
    setStore('qiche_chegu', item, 'session')
    window.history.go(-2)
  }

  componentWillMount() {
    this.handleChooseId()
  }

  componentWillUnmount() {
    // const num = document.getElementsByClassName('mask-container').length
    // for (let i = 0; i < num; i++) {
    //   document.getElementsByClassName('mask-container')[0].parentNode.remove()
    // }
  }
  render() {
    const { series = [], brandIcon, brandName, chooseSeriesId, seriesInfoData = {}, isShow, firstItem, secondItem, firshFilterList } = this.state // secondFilterList
    // console.log('state-------',this.state);
    let displacementList = []
    let gearTypeList = []
    let modelList = []

    if (seriesInfoData.modelList) {
      displacementList = seriesInfoData.displacementList
      gearTypeList = seriesInfoData.gearTypeList
      modelList = seriesInfoData.modelList
    }

    let showModelList = []
    if (firshFilterList) {
      showModelList = firshFilterList
    } else {
      showModelList = modelList
    }

    return (
      <div className='carDetailsContainer'>
        <div className='detailsTitle'>
          <img src={ brandIcon } alt='' />
          <span>{ brandName }</span>
        </div>
        <div className='detailsContainer' style={{ backgroundColor: 'e4e4e4' }}>
          {
            series.length > 0 ?
              series.map(({ seriesGroupName, seriesList }, index) => {
                return (
                  <div className='detailsGroup' key={ `seriesgroup${ Math.random() + index }` }>
                    <div className='groupName'>{ seriesGroupName }</div>
                    <ul>
                      {
                        seriesList.map(({ seriesId, seriesName }, x) => (
                          <li className='seriesMain' key={ `seriesMain${ Math.random() + x }` }>
                            <div className={ isShow && chooseSeriesId === seriesId ? 'seriesTitle arrowUp' : 'seriesTitle arrowDown' } onClick={ () => this.handleSeriesId(seriesId, seriesName) }>{ seriesName }</div>
                            <div className={ isShow && chooseSeriesId === seriesId ? 'seriesInfo showInfo' : 'seriesInfo hideInfo' }>
                              <div className='gearTypeContainer'>
                                <div className='gearTypeContainerTitle'>手自动挡</div>
                                <div className='gearTypeContainerBox'>
                                  {
                                    displacementList.length > 0 ?
                                    displacementList.map(item => (
                                      <span key={ `displacementList$${ item }` }
                                        onClick={ () => this.handlefilterFirst(item) }
                                        className={ chooseSeriesId === seriesId && firstItem === item ? 'firstChoose' : '' }
                                      >{ item }</span>
                                    ))  : ''
                                  }
                                </div>
                              </div>
                              <div className='displacementContainer'>
                                <div className='displacementTitle'>排量</div>
                                <div className='displacementBox'>
                                  {
                                    gearTypeList.length > 0 ?
                                    gearTypeList.map(item => (
                                      <span key={ `gearType$${ item }` }
                                        onClick={ () => this.handlefilterSecond(item) }
                                        className={ chooseSeriesId === seriesId && secondItem === item ? 'secondChoose' : '' }
                                      >{ item }</span>
                                    ))  : ''
                                  }
                                </div>
                              </div>
                              <div className='modelListContainer'>
                                <div className='modelListBox'>
                                  {
                                    showModelList.length > 0 ?
                                    showModelList.map((item, i) => (
                                      <div className='modelItem' key={ `modelkey${ Math.random() + i }` }
                                        onClick={ () => this.handleChooseCar(item) }
                                      >{ item.wholeModelName }</div>
                                    ))  : ''
                                  }
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                )
              })
              : ''
          }
        </div>
      </div>
    )
  }
}

export default CarDetails
