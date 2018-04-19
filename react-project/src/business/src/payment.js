import { getStore } from '@boluome/common-lib'
import paymentEnum  from './payment-enum'

export default (
  () => {
    const { payments = [] } = getStore('customerConfig', 'session') || {}

    return (
      payments.map(({ channelCode, iconUrl }) => {
        const payment = paymentEnum[channelCode]
        if (iconUrl) payment.icon = iconUrl
        return payment
      })
    )
  }
)
