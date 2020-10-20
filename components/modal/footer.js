import PropTypes from 'prop-types';
import React from 'react';

export default class ModalFooter extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    doneButton: PropTypes.bool,
    className: PropTypes.string
  }

  render() {
    const {className} = this.props;
    return <div className={`modal-footer ${className ? className : ''}`}>
      {this.props.children}
      {this.props.doneButton &&
        <button
          onClick={this.props.onHide}
          className="button primary inline pull-right">Done</button>}
      </div>;
  }
}