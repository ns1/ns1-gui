import PropTypes from 'prop-types';
import React from 'react';
import './checkbox.scss';
class CheckBoxComp extends React.Component{
  static propTypes = {
    /* eslint-disable react/no-deprecated */
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    checked: PropTypes.bool,
    name: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.any,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    help: PropTypes.string
  }
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onChange(e);
  }
  render() {
    const {help, value, label, checked, name, className} =
      this.props;
    return <label id={this.props.id} className={`checkbox-label ${className} ${help && 'has-help'} flex-wrap vert-middle`}>
      <input type="checkbox"
        value={value}
        checked={checked || false}
        onChange={this.handleChange}
        {...Object.keys(this.props).reduce((acc, prop)=>{
          return prop.indexOf('data-') > -1 ?
            Object.assign({}, acc, {[prop]: this.props[prop]}) :
            acc;
        }, {})}
        name={name}
        disabled={this.props.disabled} />
      <span className={`icon flex-wrap vert-middle ${checked ? 'checkedbox' : 'checkbox' } 
        ${this.props.disabled ? 'disabled' : ''}`}>
        <span className="check" />
      </span>
      <span>{label}</span>
      {help && <span className="help-text">{help}</span>}
    </label>;
  }
}

export const Checkbox = CheckBoxComp;
export default CheckBoxComp;
export checkboxMD from './checkbox.md';
export checkboxEX from './checkbox.ex.md';
