import React, { Component } from "react";

export default class ChatLog extends Component {
  render() {
    return (
      <div className="chat-log">
        {this.props.online !== null ? (
          this.props.online
        ) : (
          <p>Not Connected Yet</p>
        )}
      </div>
    );
  }
}
