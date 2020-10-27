export default `\`\`\`html
<div style={{width: '100%'}}>
  selected value: {this.state.cleverSelected.someKey}
  <CleverList
    formatting={i=>i.name}
    onSelect={i=>this.setState({cleverSelected: i})}
    interior={true}
    itemsVisible={2}
    pills={[
      (i) => \`Demopill $\{i.someKey}\`
    ]}
    items={[{
      someKey: 'somevalue 1',
      name: 'Example Item 1'
    }, {
      someKey: 'somevalue 2',
      name: 'Example Item 2'
    }, {
      someKey: 'somevalue 3',
      name: 'Example Item 3'
    }]} 
    options={[
      {
        icon: 'alert',
        name: 'Demo Action',
        onClick: (i, index, selector) => selector(index) || 
          window.alert(JSON.stringify(i))
      },
      {
        icon: 'folder',
        name: 'Demo Disabled',
        disabled: e=>true,
        onClick: (i, index, selector) => window.alert(JSON.stringify(i))
      }
    ]}/>
</div>
\`\`\`
`;
