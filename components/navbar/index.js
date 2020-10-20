import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export class NavBar extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    // <a href="#/"><img src="assets/ns1@2x.png" /></a>
    left: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    right: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    leftClassName: PropTypes.string,
    rightClassName: PropTypes.string,
    stickyTop: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    leftClassName: 'logo',
    rightClassName: 'nav-right self-center',
    stickyTop: false
  };

  constructor(props) {
    super(props);
    this.state = {
      sticky: false
    };
    this.handleScroll = _.debounce(this.handleScroll.bind(this), 20);
  }

  componentDidMount() {
    if (this.props.stickyTop) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    if (this.props.stickyTop) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll(event) {
    const rect = this.navbarNode.getBoundingClientRect();
    if ((!this.state.sticky && rect.top <= 0) ||
      (this.state.sticky && window.scrollY < rect.bottom)) {
      this.setState({sticky: !this.state.sticky});
      if (this.state.sticky) {
        document.body.classList.add('sticky-present');
      } else{
        document.body.classList.remove('sticky-present');
      }
    }
  }

  render() {
    const classes = `top-nav
      ${this.props.className}
      ${this.state.sticky ? 'sticky' : ''}`;
    return <div
      ref={navbar => this.navbarNode = navbar}
      className={classes}>
      <div className="bunder-container nav-container">
        <div className={this.props.leftClassName}>
          {this.props.left}
        </div>
        <ul className="nav-items">
          {this.props.children}
        </ul>
        <div className={this.props.rightClassName}>
          {this.props.right}
        </div>
      </div>
    </div>;
  }
}

export class NavItem extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    active: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool, PropTypes.string]),
    id: PropTypes.string,
    tabIndex: PropTypes.string,
    href: PropTypes.string,
    target: PropTypes.string,
    onClick: PropTypes.func,
    noLi: PropTypes.bool
  };

  static defaultProps = {
    active: false,
    className: '',
    noLi: false
  };

  render() {
    const tagClass = `nav-item
      ${this.props.className ? this.props.className : ''}
      ${this.props.active ? 'active' : ''}`;
    const link = <a
      className="nav-item"
      tabIndex={this.props.tabIndex}
      id={this.props.id}
      href={this.props.href}
      target={this.props.target}
      onClick={this.props.onClick}
      >
      {this.props.children}
    </a>;
    const Tag = this.props.noLi ? 'div' : 'li';
    return <Tag
      className={tagClass}>
        {link}
    </Tag>;
  }
}
