import React, { PureComponent } from "react";
import socketIOClient from "socket.io-client";
import TextInput from "./TextInput";
import ChatLog from "./ChatLog";
import ActiveBar from "./ActiveBar";

const ENDPOINT = "http://127.0.0.1:3000";
export default class Messaging extends PureComponent {
  constructor() {
    super();
    this.socket = socketIOClient(ENDPOINT, { query: "id=1" });
    this.state = {
      history: [],
      typing: "",
    };
  }
  componentDidMount() {
    // this.socket.emit("connection", "ID1");
    this.socket.on(
      "FromAPI",
      (data) => {
        this.setState({
          history: [...this.state.history, data],
        });
      },
      []
    );
    this.socket.on("End", (data) => {
      this.socket.disconnect();
      this.setState({
        history: [...this.state.history, data],
      });
    });
    this.socket.on("incoming-message", (data) => {
      console.log(data);
    });
  }
  componentWillUnmount() {
    this.socket.off();
  }
  updateText = (event) => {
    this.setState({ ...this.state, typing: event.target.value });
  };
  sendMessage = (room) => {
    if (this.state.typing.length > 0) {
      this.socket.emit("client-sending-message", {
        id: "1",
        room,
        content: this.state.typing,
      });
      this.setState({ ...this.state, typing: "" });
    }
  };
  render() {
    return (
      <div className="messaging-div">
        <div className="message-area">
          <ChatLog history={this.state.history} />
          <div className="text-area">
            <TextInput
              updateText={this.updateText}
              sendMessage={this.sendMessage}
            />
          </div>
        </div>
        <div className="active-bar">
          <ActiveBar />
        </div>
      </div>
    );
  }
}
