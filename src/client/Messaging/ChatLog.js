import React, { PureComponent, Fragment } from "react";

export default class ChatLog extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="chat-log">
        {this.props.log != {} ? (
          Object.keys(this.props.log).map((index) => {
            return (
              <Fragment key={index}>
                <div className="chat-message-sender">
                  {this.props.log[index].message}
                </div>
              </Fragment>
            );
          })
        ) : (
          <></>
        )}
        <div className="chat-message-recipient">RECIPIENT</div>
      </div>
    );
  }
}
