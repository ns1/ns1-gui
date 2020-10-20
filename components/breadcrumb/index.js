import PropTypes from 'prop-types';
import React from 'react';
export class Breadcrumb extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  render() {
    return <ol
      role="navigation"
      aria-label="breadcrumbs"
      className="breadcrumb">
      {this.props.children}
      </ol>;
  }
}

export class BreadcrumbItem extends React.Component {

  static propTypes = {
    active: PropTypes.bool,
    href: PropTypes.string,
    children: PropTypes.any
  }

  render() {
    return <li
      className={this.props.active ? 'active' : ''}>
      {this.props.active ?
        <span>{this.props.children}</span> :
        <a href={this.props.href}>{this.props.children}</a>
      }
      </li>;
  }
}