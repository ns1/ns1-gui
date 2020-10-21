export default `\`\`\`html
<Dropdown
  onSelect={e =>
    this.setState({
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
\`\`\`
`;
