import PropTypes from 'prop-types';
import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

class TextareaComp extends React.Component{
  static propTypes = {
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    value: PropTypes.string,
    readOnly: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    placeHolder: PropTypes.string,
    name: PropTypes.string,
    key: PropTypes.string,
    help: PropTypes.string,
    disabled: PropTypes.bool,
    // enable spellcheck, autocomplete, etc
    accoutrements: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {
    accoutrements: false,
    required: false
  };

  state = {
    touched: false
  };

  componentDidMount() {
    this.setState({
      touched: false
    });
  }

  render(){
    const {required, value, className, label, accoutrements, name,
      placeHolder, readOnly, disabled, onChange, help, id, onKeyDown} = this.props;
    let extraClasses = [];
    if (required && !value && this.state.touched) {
      extraClasses.push('invalid');
    } else if (required && this.state.touched && value) {
      extraClasses.push('valid');
    }
    if (extraClasses.length > 0) {
      extraClasses.push('touched');
    }
    return <div className={`textarea-wrap ${help && 'has-help'} ${extraClasses.join(' ')}`}>
      <label>
        {label}{required && label ? '*' : ''}</label>
      <TextareaAutosize
        autocomplete={accoutrements ? 'on' : 'off'}
        autocorrect={accoutrements ? 'on' : 'off'}
        autocapitalize={accoutrements ? 'on' : 'off'}
        spellcheck={accoutrements ? 'true' : 'false'}
        name={name}
        className="textarea"
        value={value}
        id={id}
        onKeyDown={e => {
          e.stopPropagation();
          onKeyDown && onKeyDown(e);
          this.setState({
            touched: true
          });
        }}
        placeHolder={placeHolder}
        readOnly={readOnly}
        disabled={disabled}
        onChange={onChange} />
      <span className="help-text">{help}</span>
    </div>;
  }
}

export default TextareaComp;
export const Textarea = TextareaComp;
export textareaEX from './textarea.ex.md.js';
export textareaMD from './textarea.md.js';
