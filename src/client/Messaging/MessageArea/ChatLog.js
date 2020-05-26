import React, { PureComponent, Fragment } from "react";
import Sender from "./Chatbubbles/Sender";
import Receiver from "./Chatbubbles/Receiver";
import System from "./Chatbubbles/System";
import PropTypes from "prop-types";

class ChatLog extends PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props);
  }
  render() {
    // TODO: fix css
    let { log, participants, profile } = this.props;
    let owner, message;
    return (
      <div className="chat-log">
        {log != {} ? ( // Check if it's empty chat
          Object.keys(log).map((index) => {
            // for every message in log
            owner = log[index].owner;
            message = log[index].message;
            return (
              <Fragment key={index}>
                {owner == profile.id ? (
                  <Receiver owner={profile.name} message={message} />
                ) : owner == "system" ? (
                  <System owner={"system"} message={message} />
                ) : (
                  <Sender owner={participants[owner].name} message={message} />
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

ChatLog.propTypes = {
  log: PropTypes.objectOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      room: PropTypes.string.isRequired,
    })
  ),
  participants: PropTypes.objectOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      gravatar: PropTypes.string.isRequired,
    }).isRequired
  ),
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    gravatar: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatLog;
