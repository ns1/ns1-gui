export default `\`\`\`html
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
\`\`\``;
