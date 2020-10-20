import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import './pagination.scss';

export default class Pagination extends React.Component {
  static propTypes = {
      /* eslint-disable react/no-deprecated */
      className: PropTypes.string,
      style: PropTypes.object,
      next: PropTypes.bool,
      prev: PropTypes.bool,
      items: PropTypes.number.isRequired,
      maxButtons: PropTypes.number,
      activePage: PropTypes.number,
      onSelect: PropTypes.func
  }
  constructor(props) {
    super(props);

    this.state = {
      currentItem: props.activePage || 1,
      items: props.items
    };
    this.buildPageItems = this.buildPageItems.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.items) {
      this.setState({items: nextProps.items});
      this.setState({currentItem: nextProps.activePage});
    }
  }
  changePage(item) {
    if (item < 1 || item > this.state.items) {
      return;
    }
    this.setState({currentItem : item});
    this.props.onSelect && this.props.onSelect(item);
  }
  showHeaderAndFooter() {
    const {maxButtons} = this.props;
    const {items} = this.state;
    let buttonRange = maxButtons;

    if (this.props.items < maxButtons) {
      return {
        showHeader: false,
        showFooter: false
      };
    }

    let showHeader = this.state.currentItem > Math.ceil(buttonRange/2);

    if (showHeader) {
      buttonRange -= 2;
    }

    let showFooter = this.state.currentItem < items - Math.floor(buttonRange/2);

    if (showFooter) {
      buttonRange -= 2;
      showHeader = this.state.currentItem > Math.ceil(buttonRange/2);
    }

    return {
      showHeader: showHeader,
      showFooter: showFooter
    };
  }
  getMaxButtons() {
    return this.props.items < this.props.maxButtons ? this.props.items : this.props.maxButtons;
  }
  getButtonRange() {
    const {showHeader, showFooter} = this.showHeaderAndFooter();

    let buttonRange = this.getMaxButtons();

    if (showHeader) {
      buttonRange -= 2;
    }

    if (showFooter) {
      buttonRange -= 2;
    }

    return buttonRange;
  }
  buildPageItems() {
    if (this.props.items < this.props.maxButtons) {
      return _.range(1, 1+this.props.items);
    }

    const {items, currentItem} = this.state;

    let buttonRange = this.getButtonRange();

    const midCeil = Math.ceil(buttonRange/2);

    let last = currentItem < midCeil ? 1 + buttonRange : currentItem + midCeil;

    if (last > items) {
      last = items+1;
    }

    const first = this.props.items < this.props.maxButtons ? 1 : last - buttonRange;

    return _.range(first, last);
  }
  render() {
    const {
      className, style, next, prev} = this.props;
    const {currentItem, items} = this.state;
    const {showHeader, showFooter} = this.showHeaderAndFooter();
    return <div
      className={`pagination ${className || ''} flex-wrap vert-middle auto`}
      style={style}>
      {/* PREV */}
      {prev && <span onClick={this.changePage.bind(this, currentItem-1)}
                className={`prev ${currentItem <= 1 ? 'no' : '' }`}>‹</span>}
      <span className='items'>
      {/* FIRST */}
      <span
        onClick={this.changePage.bind(this, 1)}
        className={`firstNumber item ${showHeader ? '' : 'hide'}`}>1</span>
      {/* ELLIPSIS */}
      <span
        className={`ellipsis ${showHeader ? '' : 'hide'}`}>...</span>
      {/* ITEMS */}
      {this.buildPageItems().map((elem) => {
          return <span
            key={elem}
            onClick={this.changePage.bind(this, elem)}
            className={`item ${elem === currentItem ? 'active' : ''}`}>{elem}</span>;
      })}
      {/* ELLIPSIS */}
      {<span
        className={`ellipsis ${showFooter ? '' : 'hide'}`}>...</span>}
      {/* LAST */}
      <span
        onClick={this.changePage.bind(this, this.state.items)}
        className={`item lastNumber ${showFooter ? '' : 'hide'}`}>{items}</span>
      </span>
      {next && <span
        onClick={this.changePage.bind(this, currentItem+1)}
        className={`next ${currentItem === items ? 'no' : '' }`}>›</span>}
    </div>;
  }
}
