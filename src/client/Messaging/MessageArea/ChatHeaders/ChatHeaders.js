import React, { Component } from "react";
import ChatMenu from "./ChatMenu";
import PropType from "prop-types";

class ChatHeaders extends Component {
  render() {
    let { activeTab } = this.props;
    return (
      <div className="chat-header">
        <p>{activeTab}</p>
        <div className="options">
          <ChatMenu
            participants={this.props.participants}
            roomId={this.props.roomId}
            updateOnUserLeave={this.props.updateOnUserLeave}
          />
        </div>
      </div>
    );
  }
}

ChatHeaders.propTypes = {
  activeTab: PropType.string.isRequired,
};

export default ChatHeaders;
