import PropTypes from 'prop-types';
import React from 'react';
import './formTabs.scss';
export class FormTabs extends React.Component{
  static propTypes = {
    headerLabel: PropTypes.string,
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
    const {headerLabel, onSelect, activeKey,  className} = this.props;
    return <div className="form-container">
      <div className={`header form-tabs ${className || ''}`}>
        <div className="form-tabs-header">{headerLabel}</div>
        <ul>
          {//sorry sorry, needed for single tabs
            (()=>this.props.children.filter ? this.props.children : [this.props.children])()
            .filter(d=>d)
            .map((c, idx) =>
              <li
                className={activeKey === idx && 'active' || ''}
                key={idx}
                onClick={() =>
                  onSelect(idx, c.props.token)}>
                  <span className='tab-label'>{c.props.label}</span></li>)}
        </ul>
      </div>
      <div className={`form-tabs-body ${this.props.tabClassName || ''}`}>
        {// it is dumb needed for single tabs sorry sorry
          this.props.children.filter ?
            this.props.children.filter(a=>a)[typeof this.props.activeKey !== 'undefined' ?
              this.props.activeKey :
              this.props.defaultActiveKey] :
            this.props.children}
      </div>
    </div>;
  }
}
export class FormTab extends React.Component{
  static propTypes={
    label: PropTypes.string.isRequired,
    children: PropTypes.any,
    className: PropTypes.string,
    token: PropTypes.string
  }
  constructor(props) {
    super(props);
  }
  render() {
    return <div className={`form-tab ${this.props.className || ''}`}>
      {this.props.children}
    </div>;
  }
}

export formtabsEX from './formTabs.ex.md';
export formtabsMD from './formTabs.md';
