import PropTypes from 'prop-types';
import React from 'react';

export default class ModalBody extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  render() {
    return <div className="modal-body">
      {this.props.children}
      </div>;
  }
}