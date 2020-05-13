import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";

export default class PrivateInput extends Component {
  constructor(props) {
    super(props);
  }
  handleLeave = () => {
      // get leave socket
      // set new state
      this.props.updateOnUserLeave(this.props.roomId)
      
      this.props.closeModal()
  }
  render() {
    return (
      <>
        <Modal
          open={this.props.open}
          onClose={this.props.closeModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className="modal-center">
              <h1> Are you sure that you want to leave this room? </h1>
            <br></br>
            <button onClick={this.handleLeave}>YES</button>
            <button onClick={this.props.closeModal}>NO</button>
          </div>
        </Modal>
      </>
    );
  }
}
