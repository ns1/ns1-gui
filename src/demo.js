import {render} from 'react-dom';
import React from 'react';
// import TopNav from '../components/top'
import '../scss/index.scss';
import './demo.scss';
import {BigLoader, bigloaderMD, bigloaderEX} from '../components/bigLoader';
import {Text, textMD, textEX} from '../components/text';
import {Tabs, Tab, tabsMD, tabsEX} from '../components/tabs';
import {Modal, modalMD, modalEX} from '../components/modal';
import {Dropdown, MenuItem, dropdownMD, dropdownEX} from '../components/dropdown';
import ReactMarkdown from 'react-markdown';
import installation from './installation'
import DemoBlock from './demoblock';

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
      <DemoBlock
          title="Bigloader"
          ex={bigloaderEX}
          doc={bigloaderMD}
          wrapStyle={{
            height: '150px', backgroundColor: 'white', position: 'relative'
          }}>
            <BigLoader
              warn={false} 
              warnText="This would be showing in the context of a warning."
              loading={true}
              loadingText="This is loading explainer text"
              noDatat={false}
              noDataText="This would be showing if there wasn't data" />
        </DemoBlock>
        <DemoBlock
          title="Dropdown"
          ex={dropdownEX}
          doc={dropdownMD}>
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
              value="second">Second Item</MenuItem>
          </Dropdown>
        </DemoBlock>

        <DemoBlock
          title="Text/number"
          ex={textEX}
          doc={textMD}>
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
        </DemoBlock>

        <DemoBlock
          title="Tabs"
          ex={tabsEX}
          doc={tabsMD}>
        <Tabs
          defaultActiveKey={0}
          activeKey={this.state.tabActive}
          onSelect={idx => {
            this.setState({tabActive: idx});
          }}
          className="interactive flex-whole">
          <Tab
            token={0}
            className="minheight"
            label="Demotab 1">
            <BigLoader
              warn={false} 
              warnText="This would be showing in the context of a warning."
              loading={true}
              loadingText="Demo Bigloader in tab"
              noDatat={false}
              noDataText="This woul"/>
          </Tab>
          <Tab
            token={1}
            className="minheight"
            label="Demotab 2">
            <BigLoader
              warn={true} 
              warnText="Demo warning in tab"
              loading={false}
              loadingText="This is loading explainer text"
              noDatat={false}
              noDataText="This woul"/>

          </Tab>
        </Tabs>
        </DemoBlock>

        <DemoBlock
          title="Modal"
          ex={modalEX}
          doc={modalMD}>
          <div>         
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
        </DemoBlock>
    </div>;
  }
}
window.onload = () => {
  render(<Docs />, document.getElementById('app-body'));
};
