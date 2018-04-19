import React from 'react'
import './css/oilCardPrice.scss'


const OilCardPrice = props => {
  let currIndex  = Number(props.currIndex)
  const { handleClick } = props
  const { oilPrice = [] } = props

  // console.log('oilPrice=========',props);

  if (oilPrice.length > 0) {
    if (currIndex >= oilPrice.length) {
      currIndex = 0
    }
  }

  return (
    <div className='oilCardPrice'>
      <ul>
        {
          oilPrice.map(({ facePrice, payPrice, productId, display }, index) => (
            <li key={ `arr-${ productId }` }
              onClick={ () => handleClick(index) }
              className={ currIndex === index ? 'choose' : '' } data-productId={ productId }
            >
              <h3>{ display }</h3>
              <span>{ `售价 ${ payPrice }元` }</span>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
export default OilCardPrice
