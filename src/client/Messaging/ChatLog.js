import React, { Component, Fragment } from "react";

export default class ChatLog extends Component {
  render() {
    return (
      <div className="chat-log">
        {Object.keys(this.props.log).map((index) => {
          return (
            <Fragment key={index}>
              {" "}
              <div className="chat-message">{this.props.log[index]}</div>
              <br></br>
              <br></br>
            </Fragment>
          );
        })}
      </div>
    );
  }
}
