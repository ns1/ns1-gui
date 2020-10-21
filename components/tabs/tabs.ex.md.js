export default `\`\`\`html
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
      noDataText="This would be showing if there wasn't data" />
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
      noDataText="This would be showing if there wasn't data" />

  </Tab>
</Tabs>
\`\`\``;
