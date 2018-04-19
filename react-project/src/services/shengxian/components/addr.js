import React from 'react'
import { Contact } from '@boluome/oto_saas_web_app_component'

const Addr = addr => {
  const { goOrder, contact } = addr
  console.log(contact)
  if (contact) {
    return (
      <div className='addr'>
        <Contact chooseContact={ contact } source='shengxian' handleChange={ res => { goOrder(res.contactId) } } JumpFn='true' />
      </div>
    )
  }
  return <div />
}

export default Addr
