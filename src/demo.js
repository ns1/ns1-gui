import {render} from 'react-dom';
import React from 'react';
// import TopNav from '../components/top'
import '../scss/index.scss';
import Text from '../components/text';
import {Tabs, Tab} from '../components/tabs';
import Modal from '../components/modal';
import {Dropdown, MenuItem} from '../components/dropdown';
// todo: automate this all with some preprocessor in the component files
// themselves
class Docs extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      textExample: ''
    };
    this.hideModal = this.hideModal.bind(this);
  }
  hideModal(){
    this.setState({
      showModal: false
    });
  }
  render(){
    return <div className="bunder-container">
      <h1>NS1 GUI components</h1>
      <p>
        <span className="icon folder"/>
        This is an extremely early version of a self-contained version of our GUI component library.<br/>
        We will be pushing up new components here very rapidly, and then when theres a usable subset<br/>
        published we will focus on polish, more examples, bundle size improvements, and more documentation.
      </p>

      <div className="flex-wrap wrap">
        <h3 className="flex-whole">Text/number Input</h3>
        <div className="flex-half flex-wrap">
          <Dropdown
            onSelect={e=>this.setState({
              dropdown: e.currentTarget.value
            })}
            className="flex-half"
            label="Example Dropdown"
            defaultValue="first"
            value={this.state.dropdown}>
            <MenuItem
              value="first">First Item</MenuItem>
            <MenuItem
              value="second">Second Item</MenuItem> </Dropdown>
          <span className="flex-half">Selected: {this.state.dropdown || 'None'}</span>
        </div>
        <div className="flex-half"></div>
      </div>
      <div className="flex-wrap wrap">
        <h3 className="flex-whole">Text/number Input</h3>
        <Text
          onChange={e => {
            this.setState({textExample: e.currentTarget.value});
          }}
          label="Sample text field"
          value={this.state.textExample}
          help="example help text."
          pattern={{
            pattern: val => val % 5 === 0,
            message: 'Value should be divisible by 5'
          }}
          className="flex-half gutter-right" />
        <div className="flex-half">
          # text component rough info <br/>
          ## basics <br/>
          wraps an input field, provides event handlers and inline validation <br/>
          allows for animated "pop" labels akin to material design <br/>
          allows for help text below the field when input is focused

          ## required props: <br/>
          onChange = (func) function to be called. function should accept e param. e.currentTarget represents the react virtual event instance. <br/>
          value = (string, number) initial value. this isn't strictly required, but devtools will yell at you. <br/>
          <br/>
          ## optional props: <br/>
          autoFocus: (bool) on component mount, steal focus if possible <br/>
          className: (string) dom wrapper classes to add (usually flex-* layout) <br/>
          disabled: (bool) to disable/enable <br/>
          defaultValue: (string) fallback value if none provided <br/>
          data-*: (string) used to add tags for onchange handler that are passed as attributes <br/>
          help: (string) addes help text under text element when focused <br/>
          icon: (string) icon name to use (see icons section for info) <br/>
          id: (string) suffix for id. rendered in dom, looks like: text-((props.id)) <br/>
          type: (string) passed through to input dom <br/>
          label: (string) label text <br/>
          noValid: (bool) disable inline validation <br/>
          onBlur: (func) custom onBlur handler <br/>
          onFocus: (func) custom focus handler <br/>
          onKeydown: (func) custom keydown <br/>
          onKeyPress: (func) <br/>
          pattern: (obj) object with 2 keys, message (str) and pattern (regex | func). used for inline validation. <br/>
          placeholder: (string) string for input placeholder text <br/>
          required: (string) causes error class to be added if focus then blur with no value <br/>

        </div>
      </div>
      <div className="flex-wrap wrap">
        <h3 className="flex-whole">Tabs</h3>
        <Tabs
          defaultActiveKey={0}
          activeKey={this.state.tabActive}
          onSelect={idx => {
            this.setState({tabActive: idx});
          }}
          className="flex-half interactive gutter-right">
          <Tab
            token={0}
            label="Demotab 1">
          tab1 content
          </Tab>
          <Tab
            token={1}
            label="Demotab 2">
          tab2 content
          </Tab>
        </Tabs>
        <div className="flex-half">
          <p>
            # tabs rough docs
            ## general
            import this as Tabs and Tab. Nest Tab in Tabs wrapper component
            ## props
            ### Tabs
            className: (string) optional classname string to append to builtin
            defaultActiveKey: (number) default active key if none provided
            activeKey: (number) current tab index to show tab content for
            onSelect: (func) function to call when a different tab is selected
            ### Tab
            label: (string) label for this tab
            icon: (string) optional icon for tab label
          </p>
        </div>
      </div>
      <div className="flex-wrap wrap">
        <h3 className="flex-whole">Modals</h3>
        <div className="flex-half">
          <button
            onClick={() => this.setState({showModal: true})}
            className="button primary short">
              Pop Demo Modal
          </button>
          <Modal
            show={this.state.showModal}
            onHide={() => this.hideModal()}>
            <Modal.Header
              close={true}>
              <Modal.Title>Example Modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                here is a modal body, you can put anything in here
            </Modal.Body>
            <Modal.Footer>
                here is a modal footer, usually you'd put buttons here
            </Modal.Footer>
          </Modal>
        </div>
        <div className="flex-half">
          <p>
            # modal basic docs <br/>
            ## general <br/>
            this component has multiple subcomponents; you can import the whole thing as a single component.<br/>
            nest at least Modal.Header and Modal.Body inside Modal.
            ## toplevel required props
            show: (bool) whether or not to show the modal
            onHide: (func) function to call when modal is closed
            ## modal.header required props
            close: (bool) is this modal closable
          </p>
        </div>
      </div>
    </div>;
  }
}
window.onload = () => {
  render(<Docs />, document.getElementById('app-body'));
};
