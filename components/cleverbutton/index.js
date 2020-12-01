import PropTypes from 'prop-types';
import React from 'react';
import Loader from '../loader';
class CleverButtonComp extends React.Component{
  static propTypes = {
    saved: PropTypes.bool,
    saving: PropTypes.bool,
    hot: PropTypes.bool,
    disabled: PropTypes.bool,
    classes: PropTypes.string,
    text: PropTypes.string,
    error: PropTypes.bool,
    onClick: PropTypes.func,
    role: PropTypes.string
  }
  constructor(props) {
    super(props);
  }
  render(){
    const {
      saved,
      saving,
      hot,
      disabled,
      classes,
      text,
      error,
      onClick
    } = this.props;
    return <button
      role={this.props.role}
      onClick={onClick}
      disabled={disabled}
      className={['cleverbutton', 'button', (hot || saved) && !error ? 'primary' : 'secondary', classes].join(' ')}>
        {saving && <Loader />}
        {((!saving && !saved && !error) || (hot && !saving)) && (!error) && (text || 'Save All Changes')}
        {saved && !hot &&
          [
            <span className="icon check" key={0}/>,
            <span key={1}>&nbsp;Saved!</span>
          ]}
        {!saving && error && <span className="icon closex"/>}
      </button>;
  }
}
export const CleverButton = CleverButtonComp;
export default CleverButton;
export cleverbuttonMD from './cleverbutton.md.js';
export cleverbuttonEX from './cleverbutton.ex.md.js';
