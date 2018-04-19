import React from 'react'
// import { Icon } from 'antd-mobile'
import ChangeSign from './ChangeSign'

const Refund = props => {
  const { propsObj, id, status } = props
  if (propsObj) {
    const { passengers, ChooseCredential, trains, trainNumber } = propsObj
    return (
      <div>
        <ChangeSign
          passengers={ passengers }
          ChooseCredential={ ChooseCredential }
          trains={ trains }
          orderId={ id }
          status={ status }
          trainNumber={ trainNumber }
        />
      </div>
    )
  }
  return (
    <div />
  )
}

export default Refund
