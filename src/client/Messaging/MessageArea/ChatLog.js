import React, { PureComponent, Fragment } from "react";
import Sender from "./Chatbubbles/Sender";
import Receiver from "./Chatbubbles/Receiver";

export default class ChatLog extends PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props);
  }
  render() {
    let { log, participants, profile } = this.props;
    return (
      <div className="chat-log">
        {log != {} ? (
          Object.keys(log).map((index) => {
            return (
              <Fragment key={index}>
                {log[index].owner == profile.id ? (
                  <Receiver owner={profile.name} message={log[index].message} />
                ) : (
                  <Sender
                    owner={participants[log[index].owner].name}
                    message={log[index].message}
                  />
                )}
              </Fragment>
            );
          })
        ) : (
          <></>
        )}
      </div>
    );
  }
}
