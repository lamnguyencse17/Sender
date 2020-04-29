import React, { PureComponent } from "react";
import socketIOClient from "socket.io-client";
import TextInput from "./TextInput";
import ChatLog from "./ChatLog";

const ENDPOINT = "http://127.0.0.1:3000";
export default class Messaging extends PureComponent {
  constructor() {
    super();
    this.socket = socketIOClient(ENDPOINT);
    this.state = {
      online: null,
      typing: "",
    };
  }
  componentDidMount() {
    this.socket.emit("connection");
    this.socket.on(
      "FromAPI",
      (data) => {
        this.setState({
          online: data,
        });
      },
      []
    );
  }
  componentWillUnmount() {
    this.socket.off();
  }
  updateText = (event) => {
    this.setState({ ...this.state, typing: event.target.value });
  };
  render() {
    return (
      <div className="messaging-div">
        <div className="message-area">
          <ChatLog online={this.state.online} />
          <div className="text-area">
            <TextInput updateText={this.updateText} />
          </div>
        </div>
        <div className="active-bar"></div>
      </div>
    );
  }
}
