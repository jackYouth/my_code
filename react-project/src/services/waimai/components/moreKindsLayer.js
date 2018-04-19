import React, { Component } from 'react'
import '../style/restaurantDetail.scss'

class MoreKindsLayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      manyKindPrice: 0,
      attrsArr:      [],
    }
  }

  manyKindtoShoppingCar() {
    const { onOk, activity = {} } = this.props
    const { attrsArr = [], specFood } = this.state
    const { specs = [], foodId } = specFood
    // console.log('this.state', this.state)
    // if (attrsArr.length > 0) {
    specFood.attrsArr = attrsArr
    if (attrsArr.length > 0) {
      // console.log(attrsArr.map(i => { return i.value }))
      specFood.specialId = `${ foodId }${ specs[0].value }${ attrsArr.map(i => { return i.value }) }`
    } else {
      // console.log('specFood', specFood)
      specFood.specialId = `${ foodId }${ specs[0].value }`
    }
    specFood.activity = activity
    // }
    // console.log('specFood--=-=-=-=-=-=-=-=-=-=-=', specFood)
    onOk(specFood)
    this.props.handleContainerClose()
  }

  chooseSpecs(specsName, { specFood }) {
    this.setState({ specFoodId: specFood.foodId, manyKindPrice: specFood.price, specFood })
  }

  chooseAttrs(name, values) {
    const { attrsArr } = this.state
    const hasAttr = attrsArr.filter(item => {
      return item.name === name
    })
    if (hasAttr.length > 0) {
      hasAttr[0].value = values
    } else {
      attrsArr.push({ name, value: values })
    }
    this.setState({ attrsArr })
  }

  componentWillMount() {
    const { specifications } = this.props
    this.chooseSpecs(specifications.name, specifications.values[0])
  }

  render() {
    const { specifications, attrs = [], handleContainerClose } = this.props
    const { manyKindPrice, specFoodId, attrsArr = [] } = this.state
    const { foodName } = specifications.values[0].specFood
    const specsName = specifications.name
    const specValues = specifications.values
    // console.log('props', this.props)
    return (
      <div>
        <div className='many-food-container'>
          <h3>{ foodName }</h3>
          <span className='close-container' onClick={ handleContainerClose } />
          <div className='many-food-box'>
            <div className='specsName'>{ specsName }</div>
            {
              specValues.map(item => {
                return (
                  <span key={ `specsKey${ Math.random() }` }
                    className={ specFoodId === item.specFood.foodId ? 'choose-specs-value' : 'specs-value' }
                    onClick={ () => this.chooseSpecs(specsName, item) }
                  >{ item.spec }</span>
                )
              })
            }
            {
             attrs.map(({ name, values }) => {
               return (
                 <div key={ `attrsdiv${ Math.random() }` }>
                   <div className='specsName' key={ `attrskey${ Math.random() }` }>{ name }</div>
                   <span>
                     {
                       values.map(item => {
                         return (
                           <span key={ `attrsvaluekey${ Math.random() }` }
                             className={ attrsArr.some(e => { return e.value === item }) ? 'choose-specs-value' : 'specs-value-attr' }
                             onClick={ () => this.chooseAttrs(name, item) }
                           >{ item }</span>
                         )
                       })
                     }
                   </span>
                 </div>
               )
             })
            }
          </div>
          <div className='many-foods-bottom-container'>
            <div className='manyFoods-price-container'>
              <span>{ `¥${ manyKindPrice }` }</span>
            </div>
            <button className='choosen'
              onClick={ () => this.manyKindtoShoppingCar() }
            >选好了</button>
          </div>
        </div>
      </div>
    )
  }
}

export default MoreKindsLayer
