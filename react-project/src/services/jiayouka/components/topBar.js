import React from 'react';
import ReactDOM from 'react-dom';
import './css/topBar.scss'
import { getStore } from '@boluome/common-lib'

class TopBar extends React.Component{

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick(backOrList) {
    if(this.props.backOrList){
      window.history.go(-1);
    } else {
      window.location.href = '/jiayouka/list?customerUserId=' + getStore('customerUserId','session')
    }
  }

  render() {
    let backOrList = this.props.backOrList ? 'goBack' : 'goList';
    return (
      <div className='topBar'>
        <span className={ backOrList } onClick={ () => this.handleClick(backOrList) }></span>
        <span>{ this.props.name }</span>
      </div>
    )
  }
}

export default TopBar
