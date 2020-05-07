import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import TextInput from "./TextInput";
import ActiveBar from "./ActiveBar";
import socketHandler from "../Socket/socketHandler";
import MessageAreaContainer from "./MessageArea/MessageAreaContainer";
import PropTypes from "prop-types";
import Auth from "../Auth/Auth";

const ENDPOINT = "http://127.0.0.1:3000";
class Messaging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomList: {}, // id : {title, messages: {id, message, date, owner, room}}
      activeTab: null, // name-based
    };
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
    this.socket.on("new-user", (data) => {
      let announcement = {
        id: 0,
        message: data.message,
        date: data.date,
        owner: "system",
      };
      this.setState({
        ...this.state,
        roomList: {
          ...this.state.roomList,
          [data.room]: {
            ...this.state.roomList[data.room],
            messages: {
              ...this.state.roomList[data.room].messages,
              announcement,
            },
          },
        },
      });
    });
    this.socket.on("provide-key", (data) => {
      console.log(data);
    });
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
        console.log(data);
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
  // split to file handling later
  handleFileSelect = (e) => {
    e.preventDefault();
    let test = this.buildFileSelector();
    test.onchange = this.logChange;
    test.click();
  };
  logChange = (e) => {
    let file = e.target.files[0];
    console.log(file);
    Object.keys(this.state.roomList).forEach((id) => {
      if (this.state.roomList[id].title == this.state.activeTab) {
        this.socket.emit("sending-file", {
          name: file.name,
          type: file.type,
          owner: this.state.profile.id,
          room: id,
          data: e.target.files[0],
        });
      }
    });
  };
  buildFileSelector = () => {
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.setAttribute(
      "accept",
      ".pdf,.txt,audio/*,video/*,image/*,.zip,.rar"
    );
    return fileSelector;
  };
  render() {
    let { profile, roomList, activeTab, typing } = this.state;
    return (
      <div className="messaging-div">
        <div className="message-area">
          <MessageAreaContainer
            activeTab={activeTab}
            profile={profile}
            roomList={roomList}
          />
          <TextInput
            updateText={this.updateText}
            sendMessage={this.sendMessage}
            typing={typing}
            handleFileSelect={this.handleFileSelect}
          />
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

Messaging.propTypes = {
  location: PropTypes.object.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    gravatar: PropTypes.string.isRequired,
  }).isRequired,
  auth: PropTypes.instanceOf(Auth).isRequired,
};

export default Messaging;
