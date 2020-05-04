import React, { PureComponent, Fragment } from "react";
import Sender from "./Chatbubbles/Sender";
import Receiver from "./Chatbubbles/Receiver";
import PropTypes from "prop-types";

class ChatLog extends PureComponent {
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
      id: PropTypes.string.isRequired,
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
