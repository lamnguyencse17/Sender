import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import TextInput from "./TextInput";
import ChatLog from "./ChatLog";
import ActiveBar from "./ActiveBar";

const ENDPOINT = "http://127.0.0.1:3000";
export default class Messaging extends Component {
  constructor(props) {
    super(props);
    this.socket = socketIOClient(ENDPOINT, {
      query: "id=1",
      autoConnect: false,
    });
    // console.log(this.props.location.state);
    //TODO: sync message and room
    this.socket.connect();
    this.state = {
      history: [],
      room: {},
      activeTab: null,
      indexDict: {},
    };
  }
  componentDidMount() {
    this.socket.on("subscribed-to", (room) => {
      let defaultRoom = Object.keys(room)[0];
      let newRoom = {};
      for (let key in room) {
        newRoom[key] = { id: room[key], messages: {} };
      }
      this.setState({
        ...this.state,
        activeTab: defaultRoom,
        room: { ...this.state.room, ...newRoom },
      });
    });
    this.socket.on(
      "FromAPI",
      (data) => {
        let target = null;
        for (let room in this.state.room) {
          if (data.room == this.state.room[room].id) {
            target = room;
          }
        }
        this.setState({
          ...this.state,
          room: {
            ...this.state.room,
            [target]: {
              ...this.state.room[target],
              messages: {
                ...this.state.room[target].messages,
                [data.id]: {
                  message: data.message,
                  owner: data.owner,
                  date: data.date,
                },
              },
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
      let target = null;
      for (let room in this.state.room) {
        if (data.room == this.state.room[room].id) {
          target = room;
        }
      }
      this.setState({
        ...this.state,
        room: {
          ...this.state.room,
          [target]: {
            ...this.state.room[target],
            messages: {
              ...this.state.room[target].messages,
              [data.id]: {
                message: data.message,
                owner: data.owner,
                date: data.date,
              },
            },
          },
        },
      });
    });
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  shouldComponentUpdate(nextProps, nextStates) {
    return true;
  }
  updateText = (event) => {
    this.setState({ ...this.state, typing: event.target.value });
  };
  sendMessage = (inputValue) => {
    if (inputValue.length > 0) {
      this.socket.emit("client-sending-message", {
        room: this.state.room[this.state.activeTab].id,
        message: inputValue,
        owner: "5eabfa02f209780629cd9dfe",
      });
    }
  };
  setActiveTab = (value) => {
    this.setState({
      ...this.state,
      activeTab: Object.keys(this.state.room)[value],
    });
  };
  render() {
    return (
      <div className="messaging-div">
        <div className="message-area">
          {this.state.room.hasOwnProperty(this.state.activeTab) ? (
            <ChatLog log={this.state.room[this.state.activeTab].messages} />
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
              room={Object.keys(this.state.room)}
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
