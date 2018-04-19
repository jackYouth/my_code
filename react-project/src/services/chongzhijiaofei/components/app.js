import React from 'react'

import '../styles/app.scss'

const App = ({ service, handleToServer, tips }) => (
  <div className='czjf'>
    <img className='banner' src={ require('../img/banner.png') } alt='banner' />
    <ul className='service-list'>
      {
        service.map((o, i) => {
          const { name, icon, url } = o
          return (
            <li onClick={ () => handleToServer(url) } key={ name }>
              <img src={ icon } alt={ name } />
              <p>{ name }</p>
              {
                i % 2 === 0 &&
                <p />
              }
            </li>
          )
        })
      }
    </ul>
    <p className='tips' dangerouslySetInnerHTML={{ __html: tips }} />
  </div>
)

export default App
