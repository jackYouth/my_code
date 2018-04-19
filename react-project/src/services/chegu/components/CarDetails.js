import './style/carDetails.scss'
// import { browserHistory } from 'react-router'
import React, { Component } from 'react'
import { getStore, setStore } from '@boluome/common-lib'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { List, Icon, Toast, Modal } from 'antd-mobile'
import { get, send } from 'business'

const Item = List.item

class CarDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      brandId: this.props.brandId,
      brandIcon: this.props.brandIcon,
      brandName: this.props.brandName,
      isShow: false
    }
    // console.log('CarDetails props=========',props)
  }

  // 选中品牌
  handleChooseId () {
    const handleClose = Loading()
    let brandId = this.state.brandId
    get( '/chegu/v1/car/series' , { brandId } )
    .then(({ code, data = {}, message }) => {
      if(code === 0) {
        this.setState({ series: data })
      } else {
        console.log(message)
      }
      handleClose()
    }).catch(err => {
      handleClose()
      console.log(err);
    })
  }

  // 选中车系
  handleSeriesId (seriesId) {
    const { chooseSeriesId } = this.state
    if(chooseSeriesId !== seriesId){
      const handleClose = Loading()
      this.setState({ chooseSeriesId: seriesId })
      let seriesIds = seriesId.toString()
      get( '/chegu/v1/car/model' , { seriesId: seriesIds } )
      .then(({ code, data = {}, message }) => {
        if(code === 0) {
          this.setState({ seriesInfoData: data })
          this.setState({ isShow: true })
          this.setState({ firstItem: '' })
          this.setState({ secondItem: '' })
          this.setState({ firshFilterList: '' })
          this.setState({ secondFilterList: '' })
        } else {
          console.log(message)
        }
        handleClose()
      }).catch(err => {
        handleClose()
        console.log(err);
      })
    } else {
      this.setState({ isShow: false })
      this.setState({ chooseSeriesId: '' })
    }
  }

  // 筛选手自动档
  handlefilterFirst(val) {
    this.setState({ firstItem: val }, () => this.handleFilter() )
  }
  // 筛选排量
  handlefilterSecond(val) {
    this.setState({ secondItem: val }, () => this.handleFilter() )
  }
  handleFilter(){
    const { modelList } = this.state.seriesInfoData
    const { firstItem, secondItem } = this.state
    let newArr = modelList.filter((item) => {
      if (firstItem && secondItem) {
        return item.gearType === firstItem && item.displacement === secondItem
      } else if (secondItem) {
        return item.displacement === secondItem
      } else if (firstItem) {
        return item.gearType === firstItem
      } else {
        // console.log(4);
      }
    })
    this.setState({ firshFilterList: newArr })
  }
  // 选中车型
  handleChooseCar(item) {
    const { onSuccess, handleContainerClose } = this.props
    console.log(this.props)
    onSuccess(item)
    handleContainerClose()
    // history.go(-1)
    window.history.back(2-history.length)
    // browserHistory.push('/chegu')
    // setTimeout(() => { history.go(-1) }, 0)
  }


  componentWillMount(){
    this.handleChooseId()
  }

  render(){
    const { series = [] , brandIcon, brandName, chooseSeriesId, seriesInfoData = {}, isShow, firstItem, secondItem, firshFilterList, secondFilterList } = this.state
    // console.log('state-------',this.state);
    let displacementList = []
    let gearTypeList = []
    let modelList = []

    if(seriesInfoData.modelList){
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

    return(
      <div className='carDetailsContainer'>
        <div className='detailsTitle'>
          <img src={ brandIcon } />
          <span>{ brandName }</span>
        </div>
        <div className='detailsContainer' style={{ backgroundColor: 'e4e4e4' }}>
          {
            series.length > 0 ?
              series.map(({ seriesGroupName, seriesList }, index) => {
                return(
                  <div className='detailsGroup' key={`seriesgroup${ index }`}>
                    <div className='groupName'>{ seriesGroupName }</div>
                    <ul>
                      {
                        seriesList.map(({ seriesId, seriesName }, index) => (
                          <li className="seriesMain" key={ `seriesMain${ index }` }>
                            <div className={ isShow && chooseSeriesId === seriesId ? 'seriesTitle arrowUp' : 'seriesTitle arrowDown' }
                              onClick={ () => this.handleSeriesId(seriesId) }
                              >{ seriesName }</div>
                            <div className={ isShow && chooseSeriesId === seriesId ? 'seriesInfo showInfo' : 'seriesInfo hideInfo' }>
                              <div className='gearTypeContainer'>
                                <div className='gearTypeContainerTitle'>手自动挡</div>
                                <div className='gearTypeContainerBox'>
                                  {
                                    displacementList.length > 0 ?
                                    displacementList.map((item, index) => (
                                      <span key={`displacementList$${item}`}
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
                                    gearTypeList.map((item, index) => (
                                      <span key={`gearType$${item}`}
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
                                    showModelList.map((item, index) => (
                                      <div className='modelItem' key={`modelkey${index}`}
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
