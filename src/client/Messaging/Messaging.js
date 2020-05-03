import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import TextInput from "./TextInput";
import ChatLog from "./ChatLog";
import ActiveBar from "./ActiveBar";

const ENDPOINT = "http://127.0.0.1:3000";
export default class Messaging extends Component {
  constructor(props) {
    super(props);
    //TODO: Reseach Needed To reduce this messy stuff
    if (this.props.location.state) {
      //redirect
      console.log("redirect");
      this.state = {
        profile: {
          id: this.props.location.state._id,
          email: this.props.location.state.email,
          name: this.props.location.state.name,
          gravatar: this.props.location.state.gravatar,
        },
      };
    } else if (!this.props.profile) {
      // from nowhere
      console.log("NOWHERE");
      this.state = { profile: this.props.auth.getProfile() };
      if (this.state.profile == undefined) {
        this.props.auth.logout();
      }
    } else {
      // from parent
      console.log("Parent");
      this.state = { profile: this.props.profile };
    }
    this.socket = socketIOClient(ENDPOINT, {
      query: `id=${this.state.profile.id}`,
      reconnection: true,
    });

    //TODO: sync message and room
    this.socket.connect();
    this.state = {
      history: [],
      roomList: {}, // id : {title, messages: {id, message, date, owner, room}}
      activeTab: null, // name-based
    };
  }
  componentDidMount() {
    this.socket.on("subscribed-to", (rooms) => {
      // rooms: {id: title}
      let defaultRoom = rooms[Object.keys(rooms)[0]];
      let newRoom = {};
      for (let id in rooms) {
        // key = id
        newRoom = {
          ...newRoom,
          [id]: { title: rooms[id], messages: {} },
        };
      }
      this.setState({
        ...this.state,
        activeTab: defaultRoom,
        roomList: { ...this.state.roomList, ...newRoom },
      });
    });

    this.socket.on(
      "FromAPI",
      (data) => {
        // data [{id, owner, room , message, date}]
        let returnedToState = {};
        data.forEach((message) => {
          returnedToState = {
            ...returnedToState,
            [message._id]: {
              message: message.message,
              owner: message.owner,
              room: message.room,
              date: message.date,
            },
          };
        });
        let target = null;
        for (let room in this.state.roomList) {
          if (data[0]["room"] == room) {
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
                ...returnedToState,
              },
            },
          },
        });
      },
      []
    );
    this.socket.on("incoming-message", (data) => {
      // data: {_id, message, owner, room}
      let target = null;
      for (let room in this.state.roomList) {
        if (data.room == this.state.roomList[room].id) {
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
              [date.id]: {
                message: data.message,
                owner: data.owner,
                date: data.date,
                room: data.room,
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
      Object.keys(this.state.roomList).forEach((id) => {
        if (this.state.roomList[id].title == this.state.activeTab) {
          this.socket.emit("client-sending-message", {
            room: this.state.roomList[this.state.activeTab].id,
            message: inputValue,
            owner: "5eabfa02f209780629cd9dfe",
          });
          console.log("SENT");
        }
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
    let { profile, roomList, activeTab, typing } = this.state;
    return (
      <div className="messaging-div">
        <div className="message-area">
          {/* TODO: activeTab is not compatible with new this.state.room */}
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
