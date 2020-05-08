import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";

export default class PrivateInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: "",
    };
  }
  handleChange = (e) => {
    this.setState({ privateKey: e.target.value });
  };
  savePrivateKey = () => {
    sessionStorage.setItem("privateKey", this.state.privateKey);
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
            <textarea
              rows="3"
              cols="60"
              name="description"
              placeholder="Enter private key here..."
              onChange={this.handleChange}
              style={{ wrap: "off" }}
            ></textarea>
            <br></br>
            <button onClick={this.savePrivateKey}>Save</button>
          </div>
        </Modal>
      </>
    );
  }
}
