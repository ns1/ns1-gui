import PropTypes from 'prop-types';
import React from 'react';

export class ModalHeader extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    close: PropTypes.any
  }

  render() {
    return <header>
      {this.props.close && <span
        className="close-button icon closex"
        onClick={typeof this.props.close === 'boolean' ?
          this.props.onHide :
          () => {
            this.props.close();
            this.props.onHide();
          }}/>}
      {this.props.children}
    </header>;
  }
}

export class ModalTitle extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  render() {
    return <h3>{this.props.children}</h3>;
  }
}
