import React from 'react'

import IndexSearch from '../common-component/index-search'

import '../../styles/main/categories.scss'

const Specialty = ({
  topCategoriesData, subCategoriesData,
  currentTop, handleChangeTop,
  handleToCommodities,
}) => {
  if (!topCategoriesData || !subCategoriesData) return <div />
  if (!currentTop) currentTop = topCategoriesData[0].categoryId
  return (
    <div className='categories'>
      <IndexSearch { ...{ showCart: 0, categoryLevel: 0, placeholder: '输入商家、商品名称' } } />
      <div className='categories-container'>
        <ul className='top-categories'>
          {
            topCategoriesData.map(o => (
              <li onClick={ () => handleChangeTop(o) } className={ currentTop === o.categoryId ? 'active' : '' } key={ o.categoryId }>{ o.categoryName }</li>
            ))
          }
        </ul>
        <div className={ subCategoriesData[0] && subCategoriesData[0].subSet ? 'sub-categories' : 'sub-categories three-categories' }>
          {
            subCategoriesData.map(o => {
              if (!o.subSet) {
                const { brandType, categoryId, categoryCode, categoryIcon, categoryName } = o
                return (
                  <dl key={ categoryId } onClick={ () => handleToCommodities(brandType, categoryId, categoryCode) }>
                    <dt><img src={ categoryIcon } alt={ categoryName } /></dt>
                    <dd className='line-1'>{ categoryName }</dd>
                  </dl>
                )
              }
              return <SubCategoryItem data={ o } handleToCommodities={ handleToCommodities } key={ o.categoryId } />
            })
          }
        </div>
      </div>
    </div>
  )
}
export default Specialty

const SubCategoryItem = ({ data, handleToCommodities }) => {
  const { categoryName, subSet } = data
  return (
    <div className='sub-container'>
      <p className='sub-title'>{ categoryName }</p>
      <div className='three-categories'>
        {
          subSet &&
          subSet.map(o => (
            <dl key={ o.categoryId } onClick={ () => handleToCommodities(o.brandType, o.categoryId, o.categoryCode) }>
              <dt><img src={ o.categoryIcon } alt={ o.categoryName } /></dt>
              <dd>{ o.categoryName }</dd>
            </dl>
          ))
        }
      </div>
    </div>
  )
}
