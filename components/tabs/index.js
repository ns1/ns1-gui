import PropTypes from 'prop-types';
import React from 'react';
import './tabs.scss';
export class Tabs extends React.Component{
  static propTypes = {
    defaultActiveKey: PropTypes.number.isRequired,
    activeKey: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
    children: PropTypes.any,
    tabClassName: PropTypes.string,
    className: PropTypes.string
  }
  constructor(props) {
    super(props);
  }
  render() {
    const {onSelect, activeKey,  className, children} = this.props;
    return children && <div className={`tabs ${className || ''}`}>
      <ul>
        {//sorry sorry, needed for single tabs
          (() => children.filter ? children : [children])()
            .filter(d => d)
            .map((c, idx) =>
              <li
                className={activeKey === idx && 'active' || ''}
                key={idx}
                onClick={() => onSelect &&
                onSelect(idx, c.props.token)}>
                <span className={`icon ${c.props.icon ? c.props.icon : ''}`} />
                <span className='tab-label'>{c.props.label}</span></li>)}
      </ul>

      <div className={`tabs-body ${this.props.tabClassName || ''}`}>
        {// it is dumb needed for single tabs sorry sorry
          children.filter ?
            children.filter(a => a)[typeof this.props.activeKey !== 'undefined' ?
              this.props.activeKey :
              this.props.defaultActiveKey] :
            children}
      </div>
    </div>;
  }
}
export class Tab extends React.Component{
  static propTypes={
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.string,
    token: PropTypes.string
  }
  constructor(props) {
    super(props);
  }
  render() {
    return <div className={`tab ${this.props.className || ''}`}>
      {this.props.children}
    </div>;
  }
}

export tabsMD from './tabs.md.js';
