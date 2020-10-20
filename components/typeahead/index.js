import React from 'react';
import PropTypes from 'prop-types';
import Text from './text';
import {TextMenu, MenuItem} from './dropdown';
import _ from 'lodash';

import _hotKeys from '../../lib/hotkeys.js';

const HotKeys = new _hotKeys();

export default class TypeAhead extends React.Component{
  static propTypes = {
    value: PropTypes.array,
    placeholder: PropTypes.string,
    help: PropTypes.string,
    onChange: PropTypes.func,
    async: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any
    })),
    multi: PropTypes.bool,
    selected: PropTypes.array,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    selectedPosition: PropTypes.string,
    disabledText: PropTypes.string,
    parseVal: PropTypes.func,
    onCancel: PropTypes.func,
    icon: PropTypes.any
  };
  constructor(props){
    super(props);
    this.state = {
      options: props.options || [],
      searchVal: props.searchVal || '',
      filteredOptions: [],
      selected: props.value || [],
      hideOptions: true
    };
    this.hideOptions = this.hideOptions.bind(this);
    HotKeys.register(['Escape'], 'asns', undefined, this.hideOptions, true, 'Hide asn dropdown.');
    this.renderSelected = this.renderSelected.bind(this);
    this.filter = this.filter.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.value !== this.state.selected){
      this.setState({
        selected: nextProps.value || []
      });
    }
    if (nextProps.options !== this.state.options){
      this.setState({options: nextProps.options});
    }
    // if(this.props.async){
    //   this.setState({options: nextProps.options})
    // }
  }
  componentWillUnmount(){
    HotKeys.nuke('asns');
  }
  hideOptions(){
    this.setState({hideOptions: true});
  }
  renderSelected(){
    const {parseOpt, parseVal} = this.props;
    return this.props.multi && <div className="selected">
      {this.state.selected.map(select => {
        return <span
          className="small round blue pill gutter-right"
          key={select}>
          {select}
          <span
            onClick={() => {
              this.setState({
                selected: this.state.selected
                  .filter(item => item !== select)
              });
              setTimeout(() => {
                this.props.onSelect(this.state.selected);
              });
            }}
            className="closer">
            <span className="icon closex" />
          </span>
        </span>;
      })}
    </div>;
  }
  filter(options){
    const {parseOpt, parseVal} = this.props;
    const {searchVal} = this.state;
    const small = searchVal.toLowerCase();

    return options ? options.filter(opt => {
      const val = opt.value;
      return parseOpt ?
        this.props.searchLabelIndex ? opt.label.toLowerCase().includes(small) :
          (parseOpt(opt).toLowerCase().indexOf(small) > -1 ||
        (parseVal && val) && parseVal(val).toLowerCase().indexOf(small)) :
        opt.label ? opt.label.toLowerCase().indexOf(small) > -1 ||
        opt.value.toLowerCase().indexOf(small) > -1 :
          _.isString(opt) ? opt.toLowerCase().indexOf(small) > 1 : false;
    }) : [];
  }
  render(){
    const {
      help, parseOpt, disabled, disabledText, parseVal, multi
    } = this.props;
    return <div id={this.props.id || ''} className={`typeahead ${this.props.className || ''}`}>
      {(!this.props.selectedPosition ||
        this.props.selectedPosition === 'above') &&
        this.props.selectedPosition !== false &&
        this.props.multi &&
        this.renderSelected()}
      <div className="relative">
        <Text
          autoComp={false}
          className={this.props.help ? this.props.className : `short ${this.props.className}`}
          noValid={true}
          help={help}
          ref={ta => this.ta = ta}
          passRef="typeahead"
          disabled={this.props.disabled}
          icon={typeof this.props.icon === 'undefined' ?
            (this.state.searchVal &&
              this.state.searchVal.length > 0) ?
              'closex' :
              'search' :
            false}
          onKeyDown={e => e.stopPropagation()}
          onCancel={this.props.onCancel ? () => {
            if (this.props.onCancel){
              this.props.onCancel();
            }
            this.setState({
              searchVal: '',
              filteredOptions: [],
              selected: []
            });
          } : false}
          onFocus={() =>
            this.setState({hideOptions: false}) ||
            HotKeys.register(['Escape'], 'asns', undefined, this.hideOptions, true)
          }
          onBlur={() => !this.state.eatEvent &&
              this.setState({
                hideOptions: true,
                searchVal: ''
              }) ||
              HotKeys.nuke('asns')}
          value={multi || !this.state.hideOptions ? this.state.searchVal : this.props.value}
          label={this.props.label}
          onChange={(e, val) => {
            this.setState({searchVal: e.currentTarget.value});
            if (this.props.async){
              const asynced = this.props.async(e.currentTarget.value);
              if (asynced && asynced.then){
                asynced
                  .then(vals => {
                    this.setState({options: vals || []});
                  })
                  .catch(e => {
                    console.log('catch', e);
                  });
              }
            }
            if (e.currentTarget.value.length === 0){
              this.setState({hideOptions: true});
            } else if (this.state.hideOptions){
              this.setState({hideOptions: false});
            }
          }}
          placeholder={disabled && disabledText ?
            disabledText :
            this.props.placeholder} />
        {!multi &&
            this.state.options &&
            this.state.options.length > 0 &&
            !this.state.hideOptions &&
            <ul
              onMouseLeave={() => this.setState({hideOptions: true})}
              className="options dd-menu opened">
              {this.props.async && <li
                onClick={() => this.setState({
                  options: [],
                  searchVal: '',
                  hideOptions: true
                })}>Clear results</li>}
              {this.state.options.filter(a => this.props.async ?
                a :
                a.label.toLowerCase().indexOf(this.state.searchVal.toLowerCase()) > -1)
                .map((val, idx) =>
                  <li
                    key={idx}
                    onMouseDown={() => this.setState({eatEvent: true})}
                    onMouseUp={() => {
                      this.setState({
                        selected: val,
                        eatEvent: false,
                        hideOptions: true,
                        searchVal: ''
                      });
                      setTimeout(() =>
                        this.props.onSelect &&
                            this.props.onSelect(this.state.selected), 0);
                    }}>
                    {parseOpt ?
                      parseOpt(val) :
                      val.label ?
                        val.label :
                        val}
                  </li>
                )}
            </ul>}
        {multi &&
            this.state.options && this.state.options.length > 0 &&
            <TextMenu
              onMouseDown={() => {
                this.setState({eatEvent: true});
              }}
              onSelect={(e, val) => {
                this.ta.typeahead.focus();
                this.setState({
                  selected: _.uniq(this.state.selected.indexOf(val.value ? val.value : val) > -1 ?
                    this.state.selected.filter(v => v !== (val.value ? val.value : val)) :
                    this.state.selected.concat([val.value ? val.value : val]))
                });
                setTimeout(() =>
                  this.props.onSelect &&
                    this.props.onSelect(this.state.selected), 0);
                this.setState({eatEvent: false});
              }}
              force={!this.state.hideOptions}
              multiselect={true}
              hideButton={true}>
              {this.filter(this.state.options).map((o, i) => {
                const val = parseVal ?
                  parseVal(o) :
                  o.value ?
                    o.value :
                    o;
                const label = parseOpt ?
                  parseOpt(o) :
                  o.label ?
                    o.label :
                    o;
                return <MenuItem
                  key={i}
                  checked={this.state.selected.indexOf(val) > -1}
                  value={val}>
                  {label}
                </MenuItem>;
              })}
            </TextMenu>}
      </div>
      {this.props.selectedPosition === 'below' &&
        this.props.multi &&
        this.renderSelected()}
    </div>;
  }
}
