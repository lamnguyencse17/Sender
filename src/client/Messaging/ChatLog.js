import React, { Component } from "react";

export default class ChatLog extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.log);
  }
  render() {
    return (
      <div className="chat-log">
        {Object.keys(this.props.log).map((index) => {
          return <h1 key={index}>{this.props.log[index]}</h1>;
        })}
      </div>
    );
  }
}
