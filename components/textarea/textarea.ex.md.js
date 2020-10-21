export default `\`\`\`html
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
\`\`\`
`;

