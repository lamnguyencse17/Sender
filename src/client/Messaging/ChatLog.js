import React, { PureComponent, Fragment } from "react";

export default class ChatLog extends PureComponent {
  render() {
    return (
      <div className="chat-log">
        {Object.keys(this.props.log).map((index) => {
          return (
            <Fragment key={index}>
              <div className="chat-message-sender">{this.props.log[index]}</div>
            </Fragment>
          );
        })}
        <div className="chat-message-recipient">RECIPIENT</div>
      </div>
    );
  }
}
