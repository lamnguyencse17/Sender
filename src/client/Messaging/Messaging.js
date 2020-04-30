import React, { PureComponent } from "react";
import socketIOClient from "socket.io-client";
import TextInput from "./TextInput";
import ChatLog from "./ChatLog";
import ActiveBar from "./ActiveBar";

const ENDPOINT = "http://127.0.0.1:3000";
export default class Messaging extends PureComponent {
  constructor() {
    super();
    this.socket = socketIOClient(ENDPOINT, {
      query: "id=1",
      autoConnect: false,
    });
    this.socket.connect();
    this.state = {
      history: [],
      room: {},
      activeTab: null,
    };
  }
  componentDidMount() {
    this.socket.on("subscribed-to", (room) => {
      let defaultRoom = room[0];
      room = room.reduce((a, b) => ((a[b] = {}), a), {});
      this.setState({
        ...this.state,
        activeTab: defaultRoom,
        room: { ...this.state.room, ...room },
      });
    });
    this.socket.on(
      "FromAPI",
      (data) => {
        this.setState({
          ...this.state,
          room: {
            ...this.state.room,
            [data.room]: {
              ...this.state.room[data.room],
              [data.id]: data.message,
            },
          },
        });
      },
      []
    );
    this.socket.on("End", (data) => {
      // // this.socket.disconnect();
      // this.socket.off();
      // console.log("END");
    });
    this.socket.on("incoming-message", (data) => {
      this.setState({
        ...this.state,
        room: {
          ...this.state.room,
          [data.room]: {
            ...this.state.room[data.room],
            [data.id]: data.message,
          },
        },
      });
    });
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  updateText = (event) => {
    this.setState({ ...this.state, typing: event.target.value });
  };
  sendMessage = (inputValue) => {
    console.log(inputValue);
    if (inputValue.length > 0) {
      this.socket.emit("client-sending-message", {
        id: Math.random(),
        room: this.state.activeTab,
        message: inputValue,
      });
    }
  };
  setActiveTab = (value) => {
    this.setState({ ...this.state, activeTab: value });
  };
  render() {
    return (
      <div className="messaging-div">
        <div className="message-area">
          {this.state.room.hasOwnProperty(this.state.activeTab) ? (
            <ChatLog log={this.state.room[this.state.activeTab]} />
          ) : (
            <></>
          )}
          <div className="text-area">
            <TextInput
              updateText={this.updateText}
              sendMessage={this.sendMessage}
              typing={this.state.typing}
            />
          </div>
        </div>
        <div className="active-bar">
          {Object.keys(this.state.room).length !== 0 &&
          this.state.room.constructor === Object ? (
            <ActiveBar
              room={this.state.room}
              setActiveTab={this.setActiveTab}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}
