import React, { PureComponent } from "react";

export default class Sender extends PureComponent {
  render() {
    return (
      <div className="chat-message-sender">
        <div className="owner">{this.props.owner}</div>
        {this.props.message}
      </div>
    );
  }
}
