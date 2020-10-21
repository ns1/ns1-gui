import {render} from 'react-dom';
import React from 'react';
// import TopNav from '../components/top'
import '../scss/index.scss';
import {Text, textMD} from '../components/text';
import {Tabs, Tab, tabsMD} from '../components/tabs';
import {Modal, modalMD} from '../components/modal';
import {Dropdown, MenuItem, dropdownMD} from '../components/dropdown';
import ReactMarkdown from 'react-markdown';
import installation from './installation'
console.log(dropdownMD);
console.log(textMD);
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
        This is an extremely early version of a self-contained version of our GUI component library.<br/>
        We will be pushing up new components here very rapidly, and then when theres a usable subset<br/>
        published we will focus on polish, more examples, bundle size improvements, and more documentation.
      </p>
      <h1>Installation</h1>
      <ReactMarkdown source={installation} />
      <h1>Components</h1>
      <div className="flex-wrap wrap">
        <h3 className="flex-whole">Dropdown Input</h3>
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
        <div className="flex-half">
          <ReactMarkdown
            source={dropdownMD} />
        </div>
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
        <div className="flex-half docs">
          <ReactMarkdown
            source={textMD}/>

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
          <ReactMarkdown
            source={tabsMD}/>
        </div>
      </div>
      <div className="flex-wrap wrap">
        <h3 className="flex-whole">Modals</h3>
        <div className="flex-half">
          <button
            onClick={() => this.setState({showModal: true})}
            className="button primary short inline">
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
          <ReactMarkdown source={modalMD}/>
        </div>
      </div>
    </div>;
  }
}
window.onload = () => {
  render(<Docs />, document.getElementById('app-body'));
};
