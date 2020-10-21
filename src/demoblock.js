import React from 'react';
import ReactMarkdown from 'react-markdown';
export default class DemoBlock extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return <div className="flex-wrap wrap gutter-bottom">
      <h3 className="flex-whole gutter-bottom">{this.props.title || this.props.name}</h3>
      <div className="flex-half gutter-right flex-wrap wrap">
        <div className="flex-wrap flex-whole gutter-bottom" style={this.props.wrapStyle}>{this.props.children}</div>
        <div className="flex-wrap flex-whole mdcode"><ReactMarkdown
          source={this.props.ex} /></div>
      </div>
      <div className="flex-half gutter-left">
        <ReactMarkdown source={this.props.doc} />
      </div>
    </div>;
  }
};
