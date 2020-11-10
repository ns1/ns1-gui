// unification
import React from 'react';
import PropTypes from 'prop-types';
import {OptionsMenu, MenuItem} from '../dropdown';
import {VariableSizeList as List} from 'react-window';
import {WindowScroller} from 'react-virtualized/dist/commonjs/WindowScroller';
import debounce from 'lodash.debounce';
import './cleverlist.scss';

class CleverListComp extends React.Component{
  static propTypes = {
    onEdit: PropTypes.func,
    onNavigate: PropTypes.func,
    onSelect: PropTypes.func,
    items: PropTypes.array.isRequired,
    listkey: PropTypes.string.isRequired,
    formatting: PropTypes.func,
    showOptions: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    // onClick's signature is (item, index)
    options: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      icon: PropTypes.string,
      url: PropTypes.func, // instead of onClick, you can provide a url to click
      className: PropTypes.string,
      show: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
    })),
    pills: PropTypes.arrayOf(PropTypes.func),
    // rendered below the formatted-triggered layout
    subTemplate: PropTypes.func,
    // takes precedence over the formatted, subTemplate rendered layout
    itemTemplate: PropTypes.func,
    // a way to add data-test attributes for testing
    testTemplate: PropTypes.func
  };

  constructor(props){
    super(props);
    this.selectDirect = this.selectDirect.bind(this);
    this.edit = this.edit.bind(this);
    this.fullRender = this.fullRender.bind(this);
    this.placeRender = this.placeRender.bind(this);
    this.handleListRef = this.handleListRef.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.isInViewport = this.isInViewport.bind(this);
    this.scrollToIdx = this.scrollToIdx.bind(this);
    if (this.props.asyncRenderSides){
      this.updatedRender = _.debounce(this.props.asyncRenderSides, 500);
    }
    this.state = {
      selected: 0,
      firstOnSelectFired: false
    };
    this.dummyMenu = <div className="vert-middle stack-right pull-right">
      <div className="opt-wrap item-options">
        <label className="options-menu item-options">
          <div className="dots"></div>
        </label></div>
    </div>;
  }

  componentWillMount(){
    const {listkey} = this.props;
  }

  componentDidUpdate(prevProps) {
    /* this just hooks to see if items was empty before, and now has items.
    If that's the case, fire onSelect, as the default selection logic happens
    too soon in the lifecycle to do anything meaningful.

    state.firstOnSelectFired isn't technically necessary, but is a defensive
    flag to prevent recursive handler executions if there's a bug later. */
    if (!this.state.firstOnSelectFired &&
      prevProps.items.length === 0 &&
      this.props.items.length > 0) {
      const {onSelect, items} = this.props;
      onSelect && onSelect(items[this.state.selected]);
      this.setState({firstOnSelectFired: true});
    }
  }

  scrollToIdx(idx, dir){
    const mult = typeof this.props.itemSize === 'function' ? this.props.itemSize(0) : this.props.itemSize || 48;
    window.scrollTo(0, idx * mult + (dir === 'down' ? 250 : -250));
  }
  isInViewport(e){
    if (!e){
      return false;
    }
    const bounder = e.getBoundingClientRect();
    const {top} = bounder;
    return top <= innerHeight - 80 && top >= 80;
  }

  edit(e){
    e.stopPropagation();
    const {onEdit, items} = this.props;
    const {selected} = this.state;
    onEdit && setTimeout(() => onEdit(items[selected]), 0);
  }
  selectDirect(i){
    const {onSelect, items} = this.props;
    this.setState({
      selected: i
    });
    onSelect && onSelect(items[i]);
  }

  handleListRef (component) {
    this.list = component;
    if (this.props.regRef){
      this.props.regRef(this.list);
    }
  }
  handleScroll({scrollTop}) {
    if (this.list) {
      this.list.scrollTo(scrollTop);
    }
  }
  fullRender(items){
    const {formatting, listkey, options, href, pills, navPill, itemTemplate,
      testTemplate, showOptions, hrefButton} = this.props;
    const {selected} = this.state;
    return ({index, style}) => {
      // formatted prop formats the value for display in the row
      const i = items[index];
      const formatted = typeof formatting === 'function' && formatting(i);
      const templated = typeof itemTemplate === 'function';
      // href prop returns a relative URL for the item if clicked
      const altHref = this.props.altHref ? this.props.altHref(i) : false;
      const hreffed = typeof href === 'function' && href(i);
      const np = navPill && navPill(i);
      const optionsShown = (typeof showOptions === 'function' && showOptions(i)) || true;
      // generate the list of options/pills for later use
      const appendix = (options || pills || hrefButton) &&
        <div className="vert-middle stack-right pull-right">
          {pills && pills.map((fn, ii) => {
            const res = fn(i);
            if (res) {
              return typeof res === 'string' ? <a
                key={`res-${i}-${ii}`}
                className="small upper round gray pill">{res}</a> :
                res;
            }
          })}
          {np && <a
            className="small boxy magenta pill"
            data-test-name={`${formatted}`}
            href={hreffed}>{np}<span className="icon chevron">►</span></a>}
          {hrefButton && hrefButton(i)}
          {options && optionsShown && <OptionsMenu className="item-options">
            {options && options.filter(option =>
              typeof option.show === 'function' ? !option.show(i) : true)
              .map(option => <MenuItem
                icon={option.icon}
                disabled={option.disabled && option.disabled(i)}
                key={option.name}
                className={option.className ? option.className : ''}
                url={option.url && option.url(i)}
                onClick={e => option.onClick && option.onClick(i, index, this.selectDirect)}>{option.name}</MenuItem>
              )}
          </OptionsMenu>}
        </div>;
      // if itemTemplate prop is provided, this overrides the rest.
      if (templated) {
        return <div
          onClick={() => this.selectDirect(index)}
          key={index}
          data-test={testTemplate && testTemplate(i)}
          style={style}
          id={`cleverlist-${index}`}>
          {itemTemplate(i, {
            selected: selected === index,
            appendix: appendix
          })}
        </div>;
      }
      // If unformatted, provide a default <pre> placeholder (preholder???)
      if (!formatted) {
        return <pre key={index}>{JSON.stringify(i, null, 2)}</pre>;
      }
      // otherwise, the primary rendering format uses formatted for the hyperlink
      return <div
        key={index}
        style={style}
        id={`cleverlist-${index}`}
        data-test={testTemplate && testTemplate(i)}>
        <div
          key={`${listkey}-${index}`}
          onClick={() => this.selectDirect(index)}
          className={[
            'flex-wrap flex-whole item-row address-item vert-middle',
            `${selected === index ? 'selected' : ''}`
          ].join(' ')}>
          {altHref ? altHref : hreffed ?
            <a className={this.props.widths ? this.props.widths[0] : ''} href={hreffed}><h4>{formatted}</h4></a> :
            <h4 className={this.props.widths ? this.props.widths[0] : ''}>{formatted}</h4>
          }
          {!templated && appendix}
        </div>
        {this.props.subTemplate && this.props.subTemplate(i)}
      </div>;
    };
  }
  placeRender(items){
    const {formatting, scroller, options} = this.props;
    const {selected} = this.state;
    return ({index, style}) => {
      return scroller ? scroller(items[index], style) : <div
        style={style}
        key={index}>
        <div
          className={`flex-whole flex-wrap item-row address-item vert-middle ${index === selected ? 'selected' : ''}`}>
          <h4 className={this.props.widths ? this.props.widths[0] : ''}>{formatting(items[index])}</h4>
          {options && this.dummyMenu}
        </div>
      </div>;
    };
  }
  windowScroller = () => {
    const {items, itemSize} = this.props;
    return <WindowScroller ref={ref => this.windowScroller = ref} onScroll={this.handleScroll}>
          {({height, isScrolling}) =>
            <List
              onItemsRendered={this.props.asyncRenderSides ? this.updatedRender : undefined}
              overscanCount={0}
              ref={this.handleListRef}
              className="List window-scroller-override"
              height={height}
              itemCount={items.length}
              itemSize={itemSize ? itemSize : () => {
                return 48;
              }}>{isScrolling ? this.placeRender(items) : this.fullRender(items)}</List>}
        </WindowScroller>
  }
  normalList = () => {
    const {items, itemSize} = this.props;
    const itemSized = itemSize ? itemSize : () => 48;
    const itemsVisible = this.props.itemsVisible || 10;
    return <List
      className="allow-overflow"
      onItemsRendered={this.props.asyncRenderSides ? this.updatedRender : undefined}
      overscanCount={0}
      ref={this.handleListRef}
      className="List window-scroller-override"
      height={itemSized() * itemsVisible}
      itemCount={items.length}
      itemSize={itemSized}>{this.fullRender(items)}</List>

  }

  render(){
    const {items, itemSize} = this.props;
    if (this.props.passRef){
      this.props.passRef(this);
    }
    return <div className={['cleverlist', this.props.wrapClass].join(' ')}
      onDrop={(e) => {
        const data = e.dataTransfer.getData('text/html');
        e.preventDefault();
        this.forceUpdate();
      }}>
      <div className={['clever-list', 'item-list', 'virtual', this.props.className ? this.props.className : ''].join(' ')}>
        {!this.props.interior ? this.windowScroller() : this.normalList()}
      </div>
    </div>;
  }
}

export const CleverList = CleverListComp;
export default CleverList;
export cleverlistMD from './cleverList.md.js';
export cleverlistEX from './cleverList.ex.md.js';
