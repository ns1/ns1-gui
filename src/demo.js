import {render} from 'react-dom';
import React from 'react';
// import TopNav from '../components/top'
import '../scss/index.scss';
import './demo.scss';
import {BigLoader, bigloaderMD, bigloaderEX} from '../components/bigLoader';
import {Checkbox, checkboxMD, checkboxEX} from '../components/checkbox';
import {Dropdown, MenuItem, dropdownMD, dropdownEX} from '../components/dropdown';
import {FormTabs, FormTab, formtabsEX, formtabsMD} from '../components/formTabs';
import {Modal, modalMD, modalEX} from '../components/modal';
import {Pagination, paginationMD, paginationEX} from '../components/pagination';
import {ProgressBar, progressbarMD, progressbarEX} from '../components/progressBar';
import {Radio, radioMD, radioEX} from '../components/radio';
import {Textarea, textareaMD, textareaEX} from '../components/textarea';
import {Toggle, toggleMD, toggleEX} from '../components/toggle';
import {Tooltip, tooltipMD, tooltipEX} from '../components/tooltip';
import {TypeAhead, typeaheadMD, typeaheadEX} from '../components/typeahead';
import {Text, textMD, textEX} from '../components/text';
import {Tabs, Tab, tabsMD, tabsEX} from '../components/tabs';
import {CleverList, cleverlistMD, cleverlistEX} from '../components/cleverList';
import {CleverButton, cleverbuttonMD, cleverbuttonEX} from '../components/cleverbutton';
import ReactMarkdown from 'react-markdown';
import installation from './installation'
import DemoBlock from './demoblock';

class Docs extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      textExample: '',
      cleverSelected: {
        someKey: 'somevalue 1',
        name: 'Example Item 1'
      }
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
          title="Checkbox"
          ex={checkboxEX}
          doc={checkboxMD}>
          <div>
            <Checkbox
              label="demo1"
              onChange={e=>this.setState({checkbox: e.currentTarget.value})}
              checked={this.state.checkbox === 'demo1'}
              value="demo1"/>
            <Checkbox
              label="demo2"
              onChange={e=>this.setState({checkbox: e.currentTarget.value})}
              checked={this.state.checkbox === 'demo2'}
              value="demo2"/>
          </div>
        </DemoBlock>
      <DemoBlock
          title="Cleverlist"
          ex={cleverlistEX}
          doc={cleverlistMD}>
          <div style={{width: '100%'}}>
            selected value: {this.state.cleverSelected.someKey}
            <CleverList
              formatting={i=>i.name}
              onSelect={i=>this.setState({cleverSelected: i})}
              interior={true}
              itemsVisible={2}
              pills={[
                (i) => `Demopill ${i.someKey}`
              ]}
              items={[{
                someKey: 'somevalue 1',
                name: 'Example Item 1'
              }, {
                someKey: 'somevalue 2',
                name: 'Example Item 2'
              }, {
                someKey: 'somevalue 3',
                name: 'Example Item 3'
              }]} 
              options={[
                {
                  icon: 'alert',
                  name: 'Demo Action',
                  onClick: (i, index, selector) => selector(index) || 
                    window.alert(JSON.stringify(i))
                },
                {
                  icon: 'folder',
                  name: 'Demo Disabled',
                  disabled: e=>true,
                  onClick: (i, index, selector) => window.alert(JSON.stringify(i))
                }
              ]}/>
          </div>
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
          title="Form Tabs"
          ex={formtabsEX}
          doc={formtabsMD}>
          <div className="enclosure">
            <div className="body">
              <FormTabs
                headerLabel="Important Stuff: "
                defaultActiveKey={0}
                activeKey={this.state.formTabActive}
                onSelect={idx => this.setState({formTabActive: idx})}>
                <FormTab
                  label="Tab 1">
                  ... put form elements here
                </FormTab>
                <FormTab
                  label="Tab 2">
                  ... put more form elements here
                </FormTab>
              </FormTabs>
            </div>
          </div>
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
        <DemoBlock
          title="Pagination"
          ex={paginationEX}
          doc={paginationMD}>
            <Pagination
              next={true}
              prev={true}
              items={8}
              maxButtons={5}
              activePage={this.state.activePage || 0}
              onSelect={i=>this.setState({activePage: i})} />
        </DemoBlock>
        <DemoBlock
          title="Progress Bar"
          ex={progressbarEX}
          doc={progressbarMD}>
          <ProgressBar
            className="flex-whole"
            label='Progress'
            percent={82}
            showValue={true} />

        </DemoBlock>
        <DemoBlock
          title="Radio"
          ex={radioEX}
          doc={radioMD}>
          <div>
            <Radio
              label="Thing1"
              checked={this.state.radio === 'thing1'}
              name="first"
              onChange={e => this.setState({radio: e.currentTarget.value})}
              value="thing1" />
            <Radio
              label="Thing2"
              checked={this.state.radio === 'thing2'}
              name="second"
              onChange={e => this.setState({radio: e.currentTarget.value})}
              value="thing2" />
          </div>
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
          title="Textarea"
          ex={textareaEX}
          doc={textareaMD}>
          <Textarea
            onChange={(e) => this.setState({textArea: e.currentTarget.value})}
            value={this.state.textArea}
            readOnly={false}
            id="demotext"
            label="Demo Textarea"
            placeHolder="Some text"
            name="demotextarea"
            help="textareas are for longer blocks of text"
            disabled={false}
            className="foo" />
        </DemoBlock>
        <DemoBlock
          title="Toggle"
          ex={toggleEX}
          doc={toggleMD}>
          <Toggle
            label="Demo Toggle"
            checked={this.state.toggleDemo}
            onChange={e=>this.setState({toggleDemo: e.currentTarget.checked})}
            inline={true}
            labelFirst={true} />
        </DemoBlock>
        <DemoBlock
          title="Tooltip"
          ex={tooltipEX}
          doc={tooltipMD}>
          <Tooltip
            content="demo tooltip text"
            direction='top'>
              <span> Info <span className="icon info" /></span>
          </Tooltip>
        </DemoBlock>
        <DemoBlock
          title="Cleverbutton"
          ex={cleverbuttonEX}
          doc={cleverbuttonMD}>
          <CleverButton
            saving={this.state.saving}
            saved={false}
            error={false}
            text="Submit Record"
            classes="short inline"
            onClick={()=>{
              this.setState({saving: true});
              setTimeout(()=>this.setState({saving: false}), 2000)
            }} />
        </DemoBlock>
        <DemoBlock
          title="Typeahead"
          ex={typeaheadEX}
          doc={typeaheadMD}>
          typehead stub
        </DemoBlock>

    </div>;
  }
}
window.onload = () => {
  render(<Docs />, document.getElementById('app-body'));
};
