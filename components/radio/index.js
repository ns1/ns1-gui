import PropTypes from 'prop-types';
import React from 'react';

export default class Radio extends React.Component{
  static propTypes = {
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.any,
    className: PropTypes.string

  }

  render() {
    const {value, label, checked, onChange, name, className} = this.props;
    return <label className={`radio-label ${className || ''}`}>
      <input type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        name={name}
        {...Object.keys(this.props).reduce((acc, prop)=>{
          return prop.indexOf('data-') > -1 ?
            Object.assign({}, acc, {[prop]: this.props[prop]}) :
            acc;
        }, {})} />
      <span className={`circle ${checked && 'checked'}`}>
        <span className="check" />
      </span>
      {label}
    </label>;
  }
}
