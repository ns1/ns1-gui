// unification
import React from 'react';
import PropTypes from 'prop-types';
import {OptionsMenu, MenuItem} from '../ui/dropdown.js';
import {VariableSizeList as List} from 'react-window';
import {WindowScroller} from 'react-virtualized/dist/commonjs/WindowScroller';
import HotKeys from '../../lib/hotkeys.js';
import _ from 'lodash';
import './cleverlist.scss';

export default class CleverList extends React.Component{
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
    this.back = this.back.bind(this);
    this.up = this.up.bind(this);
    this.down = this.down.bind(this);
    this.forward = this.forward.bind(this);
    this.selectDirect = this.selectDirect.bind(this);
    this.edit = this.edit.bind(this);
    this.fullRender = this.fullRender.bind(this);
    this.placeRender = this.placeRender.bind(this);
    this.handleListRef = this.handleListRef.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.isInViewport = this.isInViewport.bind(this);
    this.scrollToIdx = this.scrollToIdx.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.classes = this.classes.bind(this);
    this.updateDrag = this.updateDrag.bind(this);
    if (this.props.asyncRenderSides){
      this.updatedRender = _.debounce(this.props.asyncRenderSides, 500);
    }
    this.state = {
      selected: 0,
      firstOnSelectFired: false,
      dragging: -1,
      over: -1,
      direction: -1
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
    this.hotKeys = new HotKeys();
    this.hotKeys.register(['ArrowLeft'], `cleverlist-${listkey}`, this.back, false, false, `Navigate up 1 level in ${listkey} list.`);
    this.hotKeys.register(['ArrowRight'], `cleverlist-${listkey}`, this.forward, false, false, `Drill into the selected item in ${listkey} list.`);
    this.hotKeys.register(['ArrowDown'], `cleverlist-${listkey}`, this.down, false, false, `Move selected ${listkey} cursor down 1.`);
    this.hotKeys.register(['ArrowUp'], `cleverlist-${listkey}`, this.up, false, false, `Move selected ${listkey} cursor up 1.`);
    this.hotKeys.register(['h'], `cleverlist-${listkey}`, this.back, false, false,`Navigate up 1 level in ${listkey} list.`);
    this.hotKeys.register(['l'], `cleverlist-${listkey}`, this.forward, false, false, `Drill into the selected item in ${listkey} list.`);
    this.hotKeys.register(['j'], `cleverlist-${listkey}`, this.down, false, false, `Move selected ${listkey} cursor down 1.`);
    this.hotKeys.register(['k'], `cleverlist-${listkey}`, this.up, false, false, `Move selected ${listkey} cursor up 1.`);
    this.hotKeys.register(['e'], `cleverlist-${listkey}`, this.edit, false, false, `Edit selected item on ${listkey} list.`);
  }

  componentWillUnmount(){
    this.hotKeys.nuke(`cleverlist-${this.props.listkey}`);
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

  back(){
    const {onNavigate} = this.props;
    onNavigate && onNavigate('back', this.state.selected);
  }
  forward(){
    const {onNavigate} = this.props;
    onNavigate && onNavigate('forward', this.state.selected);
  }
  down(){
    const {onSelect, items} = this.props;
    const {selected} = this.state;
    this.setState({
      selected: selected !== items.length - 1 ?
        selected + 1 :
        items.length - 1
    });
    const inview = this.isInViewport(document.getElementById(`cleverlist-${selected}`));
    if (!inview){
      this.scrollToIdx(selected - 1, 'down');
      this.list.forceUpdate();
    }
    onSelect && onSelect(items[this.state.selected]);
  }
  up(){
    const {onSelect, items} = this.props;
    const {selected} = this.state;
    this.setState({
      selected: selected !== 0 ?
        selected - 1 :
        0
    });
    const inview = this.isInViewport(document.getElementById(`cleverlist-${selected}`));
    if (!inview) {
      this.scrollToIdx(selected - 1, 'up');
      this.list.forceUpdate();
    }
    onSelect && onSelect(items[this.state.selected]);
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
  updateDrag(dragging, direction, over){
    this.setState(Object.assign({}, {
      dragging: typeof dragging !== 'undefined' ?
        dragging :
        this.state.dragging,
      over: typeof over !== 'undefined' ?
        over :
        this.state.over,
      direction: typeof direction !== 'undefined' ?
        direction :
        this.state.direction
    }));
  }
  onDragStart(e, idx){
    e.dataTransfer.dropEffect = 'copy';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    e.dataTransfer.setDragImage(document.querySelector(`#cleverlist-${idx} > .flex-wrap`), 50, -50);
    e.dataTransfer.effectAllowed = 'copy';
    setTimeout(() => this.updateDrag(idx), 0);
  }
  onDragOver(e){
    e.preventDefault();
  }
  onDragEnter(e, idx){
    e.preventDefault();
    setTimeout(() => this.updateDrag(undefined, idx < this.state.dragging ? 0 : 1, idx), 0);
  }
  classes(idx){
    const {draggable} = this.props;
    const {dragging, over, direction} = this.state;
    const classes = [];
    if (idx === dragging){
      classes.push('dragging');
    }
    if (idx === over){
      classes.push('over');
      if (direction === 0){
        classes.push('top');
      } else {
        classes.push('bottom');
      }
    }
    return classes.join(' ');
  }
  fullRender(items){
    const {formatting, listkey, options, href, pills, navPill, itemTemplate,
      testTemplate, showOptions, draggable, onDrop, hrefButton} = this.props;
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
        data-test={testTemplate && testTemplate(i)}
        onDragStart={e => this.onDragStart(e, index)}
        onDragEnter={e => this.onDragEnter(e, index)}
        onDragOver={e => this.onDragOver(e)}
        className={this.classes(index)}
        draggable={draggable}>
        <div
          key={`${listkey}-${index}`}
          onClick={() => this.selectDirect(index)}
          className={[
            'flex-wrap flex-whole item-row address-item vert-middle',
            `${selected === index ? 'selected' : ''}`
          ].join(' ')}>
          {draggable && <span className="icon draghandle gutter-left"/>}
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
  render(){
    const {items, itemSize, onDrop} = this.props;
    if (this.props.passRef){
      this.props.passRef(this);
    }
    return <div className={['cleverlist', this.props.draggable && 'draggable', this.props.wrapClass].join(' ')}
      onDrop={(e) => {
        const data = e.dataTransfer.getData('text/html');
        e.preventDefault();
        setTimeout(() => this.updateDrag(-1,-1,-1));
        onDrop && onDrop({
          dragging: this.state.dragging,
          over: this.state.over,
          direction: this.state.direction
        });
        this.forceUpdate();

      }}>
      <div className={['clever-list', 'item-list', 'virtual', this.props.className ? this.props.className : ''].join(' ')}>
        <WindowScroller ref={ref => this.windowScroller = ref} onScroll={this.handleScroll}>
          {({height, isScrolling}) =>
            <List
              onItemsRendered={this.props.asyncRenderSides ? this.updatedRender : undefined}
              onDragOver={e => {
                e.preventDefault();
              }}
              overscanCount={0}
              ref={this.handleListRef}
              className="List window-scroller-override"
              height={height}
              itemCount={items.length}
              itemSize={itemSize ? itemSize : () => {
                return 48;
              }}>{isScrolling ? this.placeRender(items) : this.fullRender(items)}</List>}
        </WindowScroller>
      </div>
    </div>;
  }
}
