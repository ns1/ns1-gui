import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import './text.scss';

class TextComp extends React.Component{
  static propTypes = {
    autoComp: PropTypes.bool,
    autoFocus: PropTypes.bool,
    caption: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.any,
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    error: PropTypes.any,
    help: PropTypes.string,
    icon: PropTypes.string,
    id: PropTypes.string,
    key: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    name: PropTypes.string,
    noValid: PropTypes.bool,
    onBlur: PropTypes.func,
    onCancel: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyPress: PropTypes.func,
    passKey: PropTypes.string,
    passRef: PropTypes.string,
    pattern: PropTypes.any,
    placeholder: PropTypes.any,
    rapid: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    style: PropTypes.string,
    type: PropTypes.string,
    // can be used to override internal validation
    valid: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    validationMessage: PropTypes.string, // ditto
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }
  constructor(props) {
    super(props);
    this.state = {
      valid: true,
      touched: false,
      pastfocus: false,
      bounced: props.value && props.value.toString().length > 0 ||
        (typeof props.defaultValue !== 'undefined' && props.defaultValue !== null) &&
          (!props.defaultValue.toString().length ||
            props.defaultValue.toString().length > 0) ||
        typeof props.placeholder !== 'undefined' ||
        props.autoFocus ||
        (props.value && props.value === 0)
    };
    this.parseValidation = this.parseValidation.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.genRef = !props.passRef ? this.genRef = Math.random() : false;
  }
  componentWillReceiveProps(np){
    if(typeof this.props.placeholder === 'undefined' && typeof np.placeholder !== 'undefined'){
      this.setState({
        bounced: true
      });
    }
  }
  componentDidMount() {
    if (this.props.rapid){
      this.parseValidation();
    }
  }
  processPattern(pattern, val) {
    switch (typeof pattern) {
    case 'undefined':
      return true;
    case 'function':
      return pattern(val);
    case 'object':
      return Array.isArray(pattern) ?
        pattern.some(pat => pat.test(val)) :
        // regexp
        pattern.test(val);
    case 'string':
      return RegExp(pattern).test(val);
    }
  }
  parseValidation(e){
    const {required} = this.props;
    const pattern = this.props.pattern && this.props.pattern.pattern;
    const val = (e && e.currentTarget && e.currentTarget.value) ||
      this.props.value || this.props.defaultValue;
    let valid = true;
    if (this.props.noValid) {
      return true;
    } else if (val) {
      if (typeof this.props.valid === 'boolean' || !!this.props.valid) {
        valid = this.props.valid;
      } else {
        if (required) {
          valid = (val.length && val.length > 0) || typeof val === 'number';
        }
        if (valid) {
          valid = this.processPattern(pattern, val);
        }
      }
    } else {
      valid = !required;
    }
    this.setState({
      valid,
      bounced: typeof val !== 'undefined' ?
        (val.length > 0 || !_.isNaN(new Number(val))) :
        true
    });
    if (this.props.rapid){
      this.props.rapid(this.state.valid);
    }
    return false;
  }
  setFocus(){
    this[this.props.passRef].focus();
  }
  focusHandler(){
    // this.parseValidation();
    this.setState({touched: true, bounced: true});
    this.props.onFocus && this.props.onFocus();
    setTimeout(() => {
      if (this.props.passRef && this[this.props.passRef]){
        this[this.props.passRef].setSelectionRange(this.props.value.length,
          this.props.value.length);
      }
    }, 20);
  }
  classList() {
    const {help, defaultValue, error, required, disabled, pattern, className, value,
      noValid, icon, onCancel} = this.props;
    const {valid, touched, bounced, pastFocus} = this.state;
    return [
      className,
      'text-input',
      disabled && 'disabled',
      ((!required && !pattern) || noValid) && 'hide-validation',
      help || this.propsValidationMessage || pattern && pattern.message && 'has-help',
      noValid && !icon && 'no-icon',
      (bounced || defaultValue || (value && value.length > 0) || _.isNumber(value)) && 'bounced',
      error && 'error',
      touched && 'touched',
      (pastFocus || onCancel) && 'pastFocus',
      icon && 'has-icon',
      valid ?
        'valid' :
        touched && pastFocus && 'invalid'].filter(i => i).join(' ');

  }
  render() {
    const {label, help, defaultValue, style, type, onChange, required, disabled, pattern,
      readOnly, autoComp, autoFocus, noValid, icon, placeholder, onBlur,
      key, name, onCancel, passKey} = this.props;
    var {value} = this.props;
    const {valid, touched} = this.state;
    const validationMessage = this.props.validationMessage || pattern && pattern.message;
    return <div
      style={style}
      key={passKey || key}
      className={this.classList()}>
      <input
        {...Object.keys(this.props).reduce((acc, prop) => {
          return prop.indexOf('data-') > -1 ?
            Object.assign({}, acc, {[prop]: this.props[prop]}) :
            acc;
        }, {})}

        ref={(input) => {
          if (this.props.passRef){
            this[this.props.passRef] = input;
          } else {
            this[this.genRef] = input;
          }
        }}
        required={required}
        id={`text-${this.props.id || name}`}
        type={type}
        value={value}
        placeholder={defaultValue || placeholder}
        disabled={disabled}
        onKeyPress={this.props.onKeyPress}
        onFocus={e => this.focusHandler(e)}
        onBlur={e => this.setState({pastFocus: true}) ||
            (!noValid && this.parseValidation(e)) ||
            onBlur && onBlur(e)}
        onChange={e => {
          if (this.props.rapid){
            this.parseValidation(e);
          }
          onChange(e);
        }
        }
        autoComplete={!autoComp && 'off'}
        autoFocus={autoFocus}
        readOnly={readOnly}
        onKeyDown={e => {
          e.stopPropagation();
          if (e.key === 'Escape'){
            this.props.passRef && this[this.props.passRef].blur();
            !this.props.passRef && this[this.genRef].blur();
          }
          this.props.onKeyDown && this.props.onKeyDown(e);
        }} />
      {label && <label htmlFor={`text-${name}`}>{label}{required && ' *'}</label>}
      <span className="bar" />
      {valid && !noValid && <span className="icon check"/>}
      {(!valid && touched) && !noValid && <span className="icon closex invalid" />}
      {noValid && icon && !onCancel && <span className={`icon pink ${icon}`}/>}
      {this.props.caption && <span className="icon caption">{this.props.caption}</span>}
      {help && <span className="help-text">
        {help} {!valid && validationMessage ? validationMessage : ''}</span>}
      {!help && !valid && validationMessage && <span className="help-text">
        {validationMessage}</span>}
      {onCancel && <span className="icon closex" onClick={onCancel} />}
    </div>;
  }
}
export textMD from './text.md.js';
export default Text;
export const Text = TextComp;
