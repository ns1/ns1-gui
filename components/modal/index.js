import PropTypes from 'prop-types';
import React from 'react';
import {ModalTitle, ModalHeader} from './header';
import ModalBody from './body';
import ModalFooter from './footer';
import './modal.scss';

class ModalComp extends React.Component {

  static propTypes = {
    /* eslint-disable react/no-deprecated */
    className: PropTypes.string,
    children: PropTypes.any,
    show: PropTypes.bool,
    close: PropTypes.func,
    onHide: PropTypes.func,
    id: PropTypes.string,
    style: PropTypes.object,
    blocking: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    show: false,
    children: []
  };
  constructor(props){
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.onHide && this.props.onHide();
    this.props.close && this.props.close();
  }

  render() {
    return <div
      id={this.props.id}
      onClick={e => this.props.blocking ? e.stopPropagation() : false}
      className={`
        bunder-wrapper
        ${this.props.show ? 'show-modal' : ''}`}>
      <div
        className="bunder-modal-background"
        onClick={this.props.close || this.closeModal} />
      <div
        style={this.props.style}
        className={`bunder-modal ${this.props.className}`}>
        {this.props.show && this.props.children.map &&
              this.props.children.filter(a => a).map(c => {
                return typeof c.type === 'function' ?
                  Object.assign({}, c, {
                    props: Object.assign({},c.props, {onHide: this.closeModal})
                  }) :
                  c;
              })}
      </div>
    </div>;
  }
}

ModalComp.Title = ModalTitle;
ModalComp.Header = ModalHeader;
ModalComp.Body = ModalBody;
ModalComp.Footer = ModalFooter;

export default Modal;
export const Modal = ModalComp;
export modalMD from './modal.md.js';
export modalEX from './modal.ex.md';
