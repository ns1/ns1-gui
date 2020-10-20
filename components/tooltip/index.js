import PropTypes from 'prop-types';
import React from 'react';

export default class Tooltip extends React.Component{
  static propTypes = {
    /* eslint-disable react/no-deprecated */
    content: PropTypes.string.isRequired,
    direction: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.string,
    style: PropTypes.object
  }

  render() {
    const {children, content, direction, className} = this.props;
    return <div className={`tooltip-wrapper ${className ?
      className :
      ''}`}>
      <div
        style={this.props.style}
        className={`tip ${direction}`}
        dangerouslySetInnerHTML={{__html: content}} />
      {children}
    </div>;
  }
}
