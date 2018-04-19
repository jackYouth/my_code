import React, { Component } from 'react'
import { Evaluation } from '@boluome/oto_saas_web_app_component'
import { TextareaItem, Flex, Popup, Icon } from 'antd-mobile'
import { createForm } from 'rc-form'


class Evaluate extends Component {
  constructor(props) {
    super(props)
    const { rate } = props
    let currentValue = '100%'
    let currentText = '非常满意，无可挑剔'
    let textareaValue = ''
    if (rate) {
      currentValue = `${ rate.score / 0.05 }%`
      currentText = this.getCurrentText(String(rate.score), '')
      textareaValue = rate.comment
    }
    this.state = {
      currentValue,
      currentText,
      textareaValue,
    }
  }
  getCurrentText(value, currentText) {
    switch (value) {
      case '1':
        currentText = '非常不满意，各方面都很差'
        break
      case '2':
        currentText = '不满意，比较差'
        break
      case '3':
        currentText = '一般，还需改善'
        break
      case '4':
        currentText = '比较满意，仍可改善'
        break
      case '5':
        currentText = '非常满意，无可挑剔'
        break
      default:
        break
    }
    return currentText
  }
  handleSelectStar(currentValue) {
    const value = (currentValue.split('%')[0] / 20).toFixed(0)
    let { currentText } = this.state
    currentText = this.getCurrentText(value, currentText)
    this.setState({ currentValue, currentText })
  }
  handleTextareaChange(textareaValue) {
    this.setState({ textareaValue })
  }
  render() {
    const { currentText, currentValue, textareaValue } = this.state
    const { form, handlePlaceEvaluate, currentOrderInfo, rate } = this.props
    const { getFieldProps } = form
    const { id } = currentOrderInfo
    const rating = (currentValue.split('%')[0] / 20).toFixed(0)
    const FlexItem = Flex.Item
    return (
      <div className='evaluate'>
        <Flex className='header'>
          <FlexItem className='left' onClick={ () => Popup.hide() }><Icon type={ require('svg/yongche/my_cross.svg') } size='md' color='#f00' /></FlexItem>
          <FlexItem className='center'>评价</FlexItem>
          {
            !rate &&
            <FlexItem className='right' onClick={ () => { Popup.hide(); handlePlaceEvaluate(rating, textareaValue, id) } }>提交</FlexItem>
          }
          {
            rate &&
            <FlexItem className='right' />
          }
        </Flex>
        <div className='s-evaluation'>
          <Evaluation defaultValue={ currentValue } width={ '300px' } handleSelectStar={ rate ? '' : value => this.handleSelectStar(value) } />
        </div>
        <p className='evaluate-text'>{ currentText }</p>
        <TextareaItem
          { ...getFieldProps('count', {}) }
          placeholder='其他想说的（将匿名并延迟告知司机）'
          rows={ 5 }
          count={ 60 }
          disabled={ rate }
          value={ textareaValue }
          onChange={ val => this.handleTextareaChange(val) }
        />
      </div>
    )
  }
}

export default createForm()(Evaluate)
