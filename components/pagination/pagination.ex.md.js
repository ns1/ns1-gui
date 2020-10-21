export default `\`\`\`html
  <Pagination
    next={true}
    prev={true}
    items={8}
    maxButtons={5}
    activePage={this.state.activePage || 0}
    onSelect={i=>this.setState({activePage: i})} />
\`\`\` 
`;
