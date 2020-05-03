import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import TextInput from "./TextInput";
import ChatLog from "./ChatLog";
import ActiveBar from "./ActiveBar";
import socketHandler from "../Socket/socketHandler";

const ENDPOINT = "http://127.0.0.1:3000";
export default class Messaging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomList: {}, // id : {title, messages: {id, message, date, owner, room}}
      activeTab: null, // name-based
    };
    //TODO: Reseach Needed To reduce this messy stuff
    if (this.props.location.state) {
      //redirect
      console.log("redirect");
      let { _id, email, name, gravatar } = this.props.location.state;
      this.state.profile = {
        id: _id,
        email: email,
        name: name,
        gravatar: gravatar,
      };
    } else if (!this.props.profile) {
      // from nowhere
      console.log("NOWHERE");
      this.state.profile = this.props.auth.getProfile();
      if (this.state.profile == undefined) {
        this.props.auth.logout();
      }
    } else {
      // from parent
      console.log("Parent");
      this.state.profile = this.props.profile;
    }
    this.socket = socketIOClient(ENDPOINT, {
      query: `id=${this.state.profile.id}`,
      reconnection: true,
    });
    this.socket.connect();
    this.socketObj = new socketHandler();
    this.socketObj.setSocket(this.socket);
  }
  componentDidMount() {
    this.socket.on("subscribed-to", (rooms) => {
      // rooms: {id: title}
      let { defaultRoom, newRoom } = this.socketObj.subscribedRoom(rooms);
      this.setState({
        ...this.state,
        activeTab: defaultRoom,
        roomList: { ...this.state.roomList, ...newRoom },
      });
    });
    this.socket.on(
      "sync-messages",
      (data) => {
        // data: {date, message, owner, room}
        let { returnedToState, target } = this.socketObj.syncingMessages(
          data,
          this.state.roomList
        );
        this.setState({
          ...this.state,
          roomList: {
            ...this.state.roomList,
            [target]: {
              ...this.state.roomList[target],
              messages: {
                ...this.state.roomList[target].messages,
                ...returnedToState,
              },
            },
          },
        });
      },
      []
    );
    this.socket.on("incoming-message", (data) => {
      // data: {id, message, owner, room}
      let { id, message, owner, room, date } = data;
      let target = null;
      for (let room in this.state.roomList) {
        if (data.room == room) {
          target = room;
        }
      }

      this.setState({
        ...this.state,
        roomList: {
          ...this.state.roomList,
          [target]: {
            ...this.state.roomList[target],
            messages: {
              ...this.state.roomList[target].messages,
              [id]: {
                date: date,
                message: message,
                owner: owner,
                room: room,
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
  updateText = (event) => {
    this.setState({ ...this.state, typing: event.target.value });
  };
  sendMessage = (inputValue) => {
    if (inputValue.length > 0) {
      Object.keys(this.state.roomList).forEach((id) => {
        if (this.state.roomList[id].title == this.state.activeTab) {
          this.socketObj.sendMessage(inputValue, id, this.state.profile.id);
        }
      });
    }
  };
  setActiveTab = (value) => {
    this.setState({
      ...this.state,
      activeTab: this.state.roomList[Object.keys(this.state.roomList)[value]]
        .title,
    });
  };
  render() {
    let { profile, roomList, activeTab, typing } = this.state;
    return (
      <div className="messaging-div">
        <div className="message-area">
          {activeTab ? (
            <ChatLog
              log={
                roomList[
                  Object.keys(roomList).filter(
                    (id) => roomList[id].title == activeTab
                  )
                ].messages
              }
              profile={profile}
            />
          ) : (
            <></>
          )}
          <div className="text-area">
            <TextInput
              updateText={this.updateText}
              sendMessage={this.sendMessage}
              typing={typing}
            />
          </div>
        </div>
        <div className="active-bar">
          {Object.keys(roomList).length !== 0 &&
          roomList.constructor === Object ? (
            <ActiveBar
              room={Object.values(roomList).map((room) => room.title)}
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
