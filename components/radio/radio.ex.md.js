export default `\`\`\`html
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
\`\`\`
`;
