import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";

export default class PrivateInput extends Component {
  constructor(props) {
    super(props);
  }
  handleChange = (e) => {
    this.setState({ roomName: e.target.value });
  };
  handleNewRoom = () => {
    this.props.addNewRoom(this.state.roomName);
    this.props.closeModal();
  };
  render() {
    return (
      <>
        <Modal
          open={this.props.open}
          onClose={this.props.closeModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className="modal-center" style={{ background: "none" }}>
            <input
              placeholder="Enter room name here..."
              onChange={this.handleChange}
            ></input>
            <br></br>
            <button onClick={this.handleNewRoom}>Add New Room</button>
          </div>
        </Modal>
      </>
    );
  }
}
