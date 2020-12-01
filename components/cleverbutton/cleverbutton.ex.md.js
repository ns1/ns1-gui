export default `\`\`\`html
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
\`\`\`
`;

