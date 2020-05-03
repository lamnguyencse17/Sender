import React, { Component } from "react";
import ChatMenu from "./ChatMenu";

export default class ChatHeaders extends Component {
  render() {
    let { activeTab } = this.props;
    return (
      <div className="chat-header">
        <p>{activeTab}</p>
        <div className="options">
          <ChatMenu />
        </div>
      </div>
    );
  }
}
