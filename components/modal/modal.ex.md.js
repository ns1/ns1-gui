export default `\`\`\`html
<button
  onClick={() => this.setState({showModal: true})}
  className="button primary short inline">
    Pop Demo Modal
</button>
<Modal
  show={this.state.showModal}
  onHide={() => this.hideModal()}>
  <Modal.Header
    close={true}>
    <Modal.Title>Example Modal</Modal.Title>
  </Modal.Header>
  <Modal.Body>
      here is a modal body, you can put anything in here
  </Modal.Body>
  <Modal.Footer>
      here is a modal footer, usually you'd put buttons here
  </Modal.Footer>
</Modal>
\`\`\``;
