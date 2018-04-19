import React from 'react'

const Label = ({ datas,  }) => (
  <ul className='s-label'>
    {
      datas.map((item, index) => <li className={ index === currentCategoryIndex ? 'active' : '' } key={ item.industryCategoryId } onClick={ () => this.handleFilterClickMiddleware(index) }>{ item.industryCategoryName }</li>)
    }
  </ul>
)

export default Label
