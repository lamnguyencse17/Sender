import React, { Component } from "react";

export default class ChatLog extends Component {
  render() {
    return (
      <div className="chat-log">
        {this.props.history.map((message) => {
          return <h1 key={message}>{message}</h1>;
        })}
      </div>
    );
  }
}
