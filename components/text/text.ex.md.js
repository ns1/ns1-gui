export default `\`\`\`html
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
\`\`\``;
