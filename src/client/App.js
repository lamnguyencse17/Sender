import React, { Component } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3000";

export default class App extends Component {
  constructor() {
    super();
    this.socket = socketIOClient(ENDPOINT);
    this.state = {
      online: null,
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
  render() {
    return (
      <div>
        {this.state.online !== null ? (
          this.state.online
        ) : (
          <p>Not Connected Yet</p>
        )}
      </div>
    );
  }
}
