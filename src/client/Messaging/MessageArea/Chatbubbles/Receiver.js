import React, { PureComponent } from "react";

export default class Receiver extends PureComponent {
  render() {
    return (
      <div className="chat-message-recipient">
        <div className="owner">{this.props.owner}</div>
        {this.props.message}
      </div>
    );
  }
}
