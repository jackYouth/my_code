import React from 'react'

import '../styles/app.scss'

const App = ({ selfInfo, selfExperience }) => {
  return (
    <div className='resume'>
      <section className='resume-left'>
        <div className='bg' />
        <ul>
          <li><img src={ require('../imgs/resume.png') } alt='resume' /></li>
          {
            selfInfo.map(o => {
              const { title, list, sign } = o
              return (
                <li key={ title }>
                  <h1>
                    <span />
                    <span>{ title }</span>
                    <span />
                  </h1>
                  {
                    list.map(oo => {
                      if (oo.href) return <a href={ oo.href } key={ oo.name }>{ `${ oo.name }${ sign }${ oo.content }`}</a>
                      return <p key={ oo.name }>{ `${ oo.name }${ sign }${ oo.content }` }</p>
                    })
                  }
                </li>
              )
            })
          }
        </ul>
      </section>
      <section className='resume-right'>
        <h1 className='resume-right-title'>
          <span>求职意向</span>
          <span>前端开发工程师</span>
        </h1>
        <ul className='experience-list'>
          {
            selfExperience.map(o => <Experience key={ o.title } data={ o } />)
          }
        </ul>
      </section>
      <p className='s-footer-tips'>Thank you for watching ~</p>
    </div>
  )
}

export default App

const Experience = ({ data }) => {
  const { title, list } = data
  return (
    <li>
      <h1>{ title }</h1>
      {
        list.map(oo => (
          <div key={ oo.name } className='content'>
            <p className={ oo.href ? '' : 'disable' } onClick={ () => { if (oo.href) location.href = oo.href } }>{ oo.name }</p>
            <p>
              {
                oo.content.map(ooo => (<span key={ ooo }>{ ooo }</span>))
              }
            </p>
          </div>
        ))
      }
    </li>
  )
}
