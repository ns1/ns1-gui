export default `\`\`\`html
<div className="enclosure">
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
\`\`\`
`;
