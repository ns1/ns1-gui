import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import './dropdown.scss';

export class Dropdown extends React.Component {
  /* eslint-disable react/no-deprecated */
  static propTypes = {
    type: PropTypes.string,
    onSelect: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    className: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.string,
    multiselect: PropTypes.bool,
    value: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    id: PropTypes.string
  }

  constructor(props) {
    super(props);
  }

  renderDropdownLabeled() {
    return <DropdownLabeled
      id={this.props && this.props.id}
      label={this.props && this.props.label}
      className={this.props.className}
      defaultValue={this.props.defaultValue}
      value={this.props.value}
      disabled={this.props.disabled}
      style={this.props.style || {}}
      onSelect={this.props.onSelect}>
      {this.props.children}
    </DropdownLabeled>;
  }

  renderDropdownUnlabeled() {
    const dataKeys = Object.keys(this.props).filter(p => p.indexOf('data-') === 0);

    const data = dataKeys.reduce((acc, cur, i) => {
      acc[cur] = {'value': this.props[cur]};
      return acc;
    }, {});

    return <DropdownUnlabeled
      id={this.props && this.props.id}
      label={this.props && this.props.label}
      className={this.props.className}
      defaultValue={this.props.defaultValue}
      disabled={this.props.disabled}
      data={data}
      value={this.props.value}
      style={this.props.style || {}}
      onSelect={this.props.onSelect}>
      {this.props.children}
    </DropdownUnlabeled>;
  }

  render() {
    const type = this.props.type ? this.props.type.toLowerCase() : '';
    switch (type) {
    case 'labeled':
      return this.renderDropdownLabeled();
    default:
      return this.renderDropdownUnlabeled();
    }
  }
}

export class DropdownUnlabeled extends React.Component{
  static propTypes = {
    /* eslint-disable react/no-deprecated */
    label: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    onSelect: PropTypes.func,
    data: PropTypes.any,
    style: PropTypes.object.isRequired,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.label,
      opened: false
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.toggleVisible = this.toggleVisible.bind(this);
  }
  componentWillReceiveProps(np){
    if (np.label !== this.props.label){
      this.setState({label: np.label});
    }
  }
  componentDidMount() {
    this.timer = 0;
    this.setState({label: this.props.defaultValue || this.props.value || 'Select'});
  }
  onSelect(e) {
    this.setState({label: e.currentTarget.innerText});
    this.props.onSelect(e, e.currentTarget.value);
  }
  mouseEnter() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  mouseLeave() {
    this.timer = setTimeout(() => {
      this.setState({opened: false});
    }, 250);
  }
  toggleVisible() {
    !this.props.disabled && this.setState({opened: !this.state.opened});
  }
  render() {
    const {label, className} = this.props;
    const {opened} = this.state;
    return <div id={this.props.id} className={className} style={this.props.style}>
      <label
        className={`dropdown ${opened ? 'opened' : ''}`}
        onMouseLeave={this.mouseLeave}
        onMouseEnter={this.mouseEnter}
        onClick={this.toggleVisible.bind(this)}>
        <div className={`dd-button ${this.props.className} ${this.props.disabled ? ' disabled' : ''}`}>
          {this.state.label}
        </div>
        <ul className='dd-menu'>
          {this.props.children && this.props.children.map((child, index) =>
            child && child.props && React.cloneElement(child,
              {
                ...child.props,
                key: index,
                onClick: child.props.onClick ?
                  () => this.toggleVisible() || child.props.onClick({
                    currentTarget:Object.assign({},{
                      value: child.props.value,
                      innerText: child.props.children
                    }, {'attributes': this.props.data})}, child.props.value) :
                  () => this.toggleVisible() || this.onSelect({
                    currentTarget:Object.assign({}, {
                      value: child.props.value,
                      innerText: child.props.children
                    }, {'attributes': this.props.data})}, child.props.value)
              })
          )}
        </ul>
      </label>
    </div>;
  }
}

export class DropdownLabeled extends React.Component {
  static propTypes = {
    /* eslint-disable react/no-deprecated */
    label: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    onSelect: PropTypes.func,
    data: PropTypes.any,
    value: PropTypes.any,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    id: PropTypes.id
  }
  constructor(props) {
    super(props);
    this.originalLabel = this.props.label;
    this.state = {
      label: this.props.label,
      opened: false
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.toggleVisible = this.toggleVisible.bind(this);
  }
  componentDidMount() {
    this.timer = 0;
    this.setState({label: this.props.defaultValue || this.props.value || 'Select'});
  }
  componentDidUpdate(prevProps){
    if (prevProps.value !== this.props.value || prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({label: this.props.value || this.props.defaultValue || 'Select'});
    }
  }
  onSelect(e) {
    this.props.onSelect(e, e.currentTarget.value);
    setTimeout(() =>
      this.setState({label: this.props.value}), 0);
  }
  mouseEnter() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  mouseLeave() {
    this.timer = setTimeout(() => {
      this.setState({opened: false});
    }, 250);
  }
  toggleVisible() {
    !this.props.disabled && this.setState({opened: !this.state.opened});
    return false;
  }
  render() {
    const {className} = this.props;
    const {label, opened} = this.state;
    return <div id={this.props.id} className={className}><label
      className={`dropdown ${opened ? 'opened' : ''}`}
      style={this.props.style}
      onMouseLeave={this.mouseLeave}
      onMouseEnter={this.mouseEnter}
      onClick={this.toggleVisible.bind(this)}>
      <span className='external-label'>{this.originalLabel}</span>
      <div className='wrap'>
        <div className={`dd-button ${this.props.className} ${this.props.disabled ? ' disabled' : ''}`}>{label}</div>
        <ul className='dd-menu'>
          {this.props.children.map((child, index) =>
            child && child.props && React.cloneElement(child,
              {
                ...child.props,
                onClick: child.props.onClick ?
                  () => this.toggleVisible() || child.props.onClick({
                    currentTarget:{
                      value: child.props.value,
                      innerText: child.props.value
                    }}, child.props.value) :
                  () => this.toggleVisible() || this.onSelect({
                    currentTarget:{
                      value: child.props.value,
                      innerText: child.props.value
                    }}, child.props.value)
              })
          )}
        </ul>
      </div>
    </label></div>;
  }
}

export class OptionsMenu extends React.Component {
  static propTypes = {
    /* eslint-disable react/no-deprecated */
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    onSelect: PropTypes.func,
    className: PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.toggleVisible = this.toggleVisible.bind(this);
  }
  componentDidMount() {
    this.timer = 0;
  }
  onSelect() {
    return this.props.onSelect && this.props.onSelect();
  }
  mouseEnter() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  mouseLeave() {
    this.timer = setTimeout(() => {
      this.setState({opened: false});
    }, 250);
  }
  toggleVisible(e) {
    if (e){
      e.preventDefault() ||
      e.stopPropagation();
    }
    this.setState({opened: !this.state.opened});
    return false;
  }
  render() {
    const {opened} = this.state;
    return <div className={`opt-wrap ${this.props.className ? this.props.className : ''}`}>
      <label
        className={`options-menu ${this.props.className ?
          this.props.className :
          ''}`}>
        <div className={`dots ${opened ? 'opened' : ''}`}
          onMouseLeave={this.mouseLeave}
          onMouseEnter={this.mouseEnter}
          onClick={this.toggleVisible}>
        </div>
        <ul
          onMouseLeave={this.mouseLeave}
          onMouseEnter={this.mouseEnter}
          className={`dd-menu ${opened ? 'opened' : ''}`}>
          {this.props.children.map((child, idx) =>
            child && child.props && React.cloneElement(child, {
              onClick: child.props.onClick ?
                e => this.toggleVisible() || child.props.onClick(e) :
                e => this.toggleVisible() || this.onSelect(e),
              key: idx
            })
          )}
        </ul>
      </label>
    </div>;
  }
}

export class TextMenu extends React.Component {
  static propTypes = {
    label: PropTypes.any,
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    onSelect: PropTypes.func,
    multiselect: PropTypes.bool,
    edge: PropTypes.string,
    icon: PropTypes.string,
    tabIndex: PropTypes.string,
    hideButton: PropTypes.bool,
    force: PropTypes.bool,
    onMouseDown: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.label,
      opened: false,
      numSelected: 0
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.toggleButton = this.toggleButton.bind(this);
    this.showNumSelected = this.showNumSelected.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }
  componentDidMount() {
    this.timer = 0;
  }
  onSelect(event, value) {
    this.setState({opened: false});
    this.props.onSelect && this.props.onSelect(event, value);
  }
  mouseEnter() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  mouseLeave() {
    this.timer = setTimeout(() => {
      this.setState({opened: false});
    }, 250);
  }
  showNumSelected() {
    if (this.state.numSelected && !this.state.opened) {
      return <span>
        <span className='line'></span>
        <span className='number'>
          {this.state.numSelected} Selected
        </span>
      </span>;
    }
  }
  toggleButton() {
    this.setState({opened: !this.state.opened});
  }
  toggleVisible() {
    this.setState({opened: !this.state.opened});
  }
  render() {
    const {multiselect, style, id, force, children, className, label, hideButton} = this.props;
    const {opened} = this.state;
    return <div
      style={{style} || ''}
      id={id || ''}
      onMouseDown={this.props.onMouseDown}
      className={`text-menu ${multiselect ? 'multi' : ''} ${className ? className : ''} ${hideButton ? 'hidebutton' : ''}`}>
      <div className='wrap'>
        {this.props.namespan && <span className="namespan">{this.props.namespan}</span>}
        {this.props.icon && <span className={`icon ${this.props.icon}`}/>}
        <button
          tabIndex={this.props.tabIndex}
          onMouseLeave={this.mouseLeave}
          onMouseEnter={this.mouseEnter}
          className={`dd-button ${opened ? 'opened' : ''}`}
          onClick={this.toggleButton}>{label}</button>
        {multiselect && this.showNumSelected()}
        <ul
          onMouseLeave={this.mouseLeave}
          onMouseEnter={this.mouseEnter}
          className={`dd-menu ${opened || force ? 'visible' : ''} ${this.props.edge}`}>
          {this.props.children.map((child, idx) =>
            !_.isArray(child) ?
              child && child.props && React.cloneElement(child,
                {onClick: child.props.onClick ?
                  child.props.onClick :
                  (c, v) => this.onSelect(c, v),
                hascheck: multiselect,
                key: idx
                }) :
              child.map(c => c && c.props && React.cloneElement(c,
                {onClick: c.props.onClick ?
                  c.props.onClick :
                  (c, v) => this.onSelect(c, v),
                hascheck: multiselect,
                key: idx
                }))
          )}
        </ul></div></div>;
  }
}

export class SubMenu extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    onSelect: PropTypes.func,
    className: PropTypes.string,
    alignment: PropTypes.string
  }
  static defaultProps = {
    className: ''
  }
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.label,
      recentlyClicked: false
    };
  }
  hide() {
    this.setState({recentlyClicked: true});
    setTimeout(() => {
      this.setState({recentlyClicked: false});
    }, 0);
  }
  render() {
    const {label, children} = this.props;
    return !this.state.recentlyClicked && <div
      className={`submenu ${this.props.alignment || ''} ${this.props.className}`}>{label}
      <ul className={`dd-menu ${this.props.alignment || ''}`}>
        {this.props.children.map((child, idx) =>
          child && child.props && React.cloneElement(child, {
            onClick: child.props.onClick ? e => {
              this.hide() || child.props.onClick(e);
            } : () => {},
            key: idx
          })
        )}
      </ul>
    </div>;
  }
}

export class MenuItem extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    url: PropTypes.string,
    children: PropTypes.any,
    hascheck: PropTypes.bool,
    exists: PropTypes.any,
    className: PropTypes.string,
    checked: PropTypes.bool,
    testPrefix: PropTypes.string
  };
  static defaultProps = {
    testPrefix: ''
  };
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }
  click(e) {
    if (e){
      e.stopPropagation();
    }
    if (this.props.onClick && !this.props.disabled) {
      this.props.onClick({
        currentTarget: {
          value: typeof this.props.value === 'undefined' ? '' : this.props.value,
          innerText: this.props.children
        }
      }, this.props.value);
    }
  }
  render() {
    const {exists, hascheck, url, children, disabled,
      icon, className, checked, testPrefix} = this.props;
    const textContent = children.toString().replace(/[\s^A-Za-z0-9]+]/g, '_');
    const dataTest = (testPrefix) ?
      `${testPrefix}-${textContent}` :
      textContent;
    return (typeof exists !== 'undefined' && !exists) ?
      <span/> :
      !url ?
        <li
          key={textContent}
          data-test={dataTest}
          className={`${checked ? 'ticked' : ''} ${disabled ? 'disabled' : ''} ${className || ''}`}
          onClick={e =>
            this.click(e)}>
          {icon &&
                <span className={`icon ${icon}`}></span>
          }
          <span>{children}</span>
          {hascheck &&
                <span>
                  <span className='checkmark'>✓</span>
                </span>
          }
        </li> :
        <li
          className="url"
          onClick={e => this.click(e)}>{icon &&
            <span className={`icon ${icon}`}/>}
          <span>
            <a href={url}>{children}</a>
          </span>
        </li>;
  }
}
export default 'You borked the import for the dropdown!';
