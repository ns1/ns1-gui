import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import _hotKeys from '../../lib/hotkeys.js';

const c = 'key-value';
// stolen from https://raw.githubusercontent.com/purposeindustries/react-key-value/master/src/key-value.js

// needed to edit how it worked, didn't feel like forking
export default class KeyValue extends React.Component {
  static displayName = 'KeyValue'

  static propTypes = {
    rows: PropTypes.arrayOf(PropTypes.shape({
      keyItem: PropTypes.string,
      valueItem: PropTypes.string
    })),
    onChange: PropTypes.func,
    customAddButtonRenderer: PropTypes.func,
    keyInputPlaceholder: PropTypes.string,
    valueInputPlaceholder: PropTypes.string,
    hideLabels: PropTypes.bool,
    canStealFocus: PropTypes.bool
  }

  static defaultProps = {
    rows: [],
    onChange: () => {},
    keyInputPlaceholder: '',
    valueInputPlaceholder: '',
    hideLabels: false,
    canStealFocus: true
  }

  constructor(props) {
    super(props);
    this.state = {
      rows: [
        ...this.props.rows
      ]
    };
    this.stealFocus = this.stealFocus.bind(this);
    this.hk = new _hotKeys();
  }
  stealFocus(e){
    if (e.key === 't' && this.props.canStealFocus){
      e.preventDefault();
      if (this.state.rows.length === 0){
        return this.handleAddNew();
      }
      setTimeout(e => this['key-0'].focus(),20) ;
    }
  }
  componentDidMount(){
    window.addEventListener('keydown', this.stealFocus);
  }
  componentWillUnmount(){
    window.removeEventListener('keydown', this.stealFocus);
  }
  componentWillReceiveProps(np){
    if (!_.isEqual(this.props.rows, np.rows)){
      this.setState({rows: np.rows});
    }
  }

  handleAddNew = () => {
    this.setState({
      rows: [
        ...this.state.rows,
        {
          keyItem: '',
          valueItem: ''
        }
      ]
    }, () => {
      this.props.onChange([...this.state.rows]);
      setTimeout(() => this[`key-${this.state.rows.length - 1}`].focus(), 20);
    });
  }

  handleKeyItemChange(index, value) {
    this.setState({
      rows: this.state.rows.map((row, i) => {
        if (index !== i) {
          return row;
        }
        return {
          ...row,
          keyItem: value
        };
      })
    }, () => {
      this.props.onChange([...this.state.rows]);
    });
  }

  handleValueItemChange(index, value) {
    this.setState({
      rows: this.state.rows.map((row, i) => {
        if (index !== i) {
          return row;
        }
        return {
          ...row,
          valueItem: value
        };
      })
    }, () => {
      this.props.onChange([...this.state.rows]);
    });
  }

  handleRemove(index) {
    this.setState({
      rows: this.state.rows.filter((row, i) => i !== index)
    }, () => {
      this.props.onChange([...this.state.rows]);
    });
  }

  toJSON() {
    const {rows = []} = this.state;
    return rows.reduce((acc, row) => {
      acc[row.keyItem] = row.valueItem;
      return acc;
    }, {});
  }

  renderLabelText(text) {
    if (this.props.hideLabels === true) {
      return null;
    }
    return (
      <span>
        { text }
      </span>
    );
  }

  renderKeyItem(index, value) {
    return (
      <label>
        { this.renderLabelText('Key:') }
        <input
          type="text"
          ref={key => this[`key-${index}`] = key}
          value={ value }
          onKeyDown={e => {
            e.stopPropagation();
            if (e.key === 'Enter'){
              this.props.submit(e);
              Object.keys(this)
                .filter(k => k.indexOf('key-') === 0)
                .map(k => this[k].blur());
            }
          }}
          placeholder={ this.props.keyInputPlaceholder }
          onChange={ (e) => this.handleKeyItemChange(index, e.currentTarget.value) } />
      </label>
    );
  }

  renderValueItem(index, value) {
    return (
      <label>
        { this.renderLabelText('Value:') }
        <input
          type="text"
          ref={key => this[`value-${index}`] = key}
          value={ value }
          placeholder={ this.props.valueInputPlaceholder }
          onKeyDown={e => {
            e.stopPropagation();
            if (e.key === 'Enter'){
              this.props.submit(e);
              Object.keys(this)
                .filter(k => k.indexOf('value-') === 0)
                .map(k => this[k].blur());
            }
            if (e.key === 'Tab' && !e.shiftKey && index === this.state.rows.length - 1){
              this.handleAddNew();
            }
          }}
          onChange={ (e) => this.handleValueItemChange(index, e.currentTarget.value) }/>
      </label>
    );
  }

  renderRows() {
    return this.state.rows.map((row, i) => (
      <div
        key={ `key-value-row-${i}` }
        className={ `${c}-row` }>
        <div className={ `${c}-row-key-item` }>
          { this.renderKeyItem(i, row.keyItem) }
        </div>
        <div className={ `${c}-row-value-item` }>
          { this.renderValueItem(i, row.valueItem) }
        </div>
        <div className={ `${c}-row-remove` }>
          <span
            onClick={ () => this.handleRemove(i) }
            data-test-delete={row.keyItem}
            className="icon primary trash" />
        </div>
      </div>
    ));
  }

  renderAddButton() {
    return <div
      onClick={e => this.handleAddNew(e)}
      className="button tertiary inline small short">Add Metadata +</div>;
  }

  render() {
    return (
      <div className={ c }>
        <div className={ `${c}-rows` }>
          { this.renderRows() }
        </div>
        <div className={ `${c}-add-new` }>
          { this.renderAddButton() }
        </div>
      </div>
    );
  }
}
