export default `\`\`\`html
<Toggle
  label="Demo Toggle"
  checked={this.state.toggleDemo}
  onChange={e=>this.setState({
    toggleDemo: e.currentTarget.checked
  })}
  inline={true}
  labelFirst={true} />
  \`\`\`
`;
