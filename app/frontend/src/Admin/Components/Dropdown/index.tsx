import React from 'react'
import classnames from 'classnames'
import arrowDown from '../../../Common/Utils/Media/arrowDown.svg'
import { IProps, IState, IOption } from './types'
import './styles.scss'

class DropDown extends React.Component<IProps, IState> {
  readonly state: IState = {
    isListVisible: false
  }

  componentDidUpdate() {
    if (this.state.isListVisible) {
      document.addEventListener('click', this.toggleListVisibility)
    } else if (!this.state.isListVisible) {
      document.removeEventListener('click', this.toggleListVisibility)
    }
  }

  toggleListVisibility = (): void => {
    this.setState(prevState => ({ isListVisible: !prevState.isListVisible }))
  }

  handleSelectOption = (el: IOption): void => {
    const { onChange, saveAsObject } = this.props
    this.setState({ isListVisible: false })
    onChange({
      target: {
        id: this.props.id,
        value: saveAsObject ? { _id: el._id, name: el.name } : el.name
      }
    })
  }

  renderOptions = (optionsArr: IOption[]): JSX.Element[] => {
    return optionsArr.map(
      (el: IOption): JSX.Element => {
        return (
          <div
            key={el._id}
            onClick={() => this.handleSelectOption(el)}
            className="spon-dropdown__list-item">
            <p>{el.name}</p>
          </div>
        )
      }
    )
  }

  render() {
    const { isListVisible } = this.state
    const { options, label, placeholder, selectedValue, className } = this.props
    const dropdownClass = classnames('spon-dropdown', {
      [`${className}`]: className
    })
    const dropdownElementClass = classnames('spon-dropdown__element', {
      'spon-dropdown__element--active': isListVisible
    })
    const dropdownIcon = classnames('spon-dropdown__placeholder-icon', {
      'spon-dropdown__placeholder-icon--active': isListVisible
    })
    const dropdownList = classnames('spon-dropdown__list', {
      'spon-dropdown__list--active': isListVisible
    })

    return (
      <div className={dropdownClass}>
        <p className="spon-dropdown__label">{label}</p>
        <div
          className={dropdownElementClass}
          onClick={this.toggleListVisibility}>
          <div className="spon-dropdown__placeholder">
            <p>{selectedValue || placeholder}</p>
            <div>
              <img className={dropdownIcon} src={arrowDown} />
            </div>
          </div>
          <div className={dropdownList}>{this.renderOptions(options)}</div>
        </div>
      </div>
    )
  }
}

export default DropDown
