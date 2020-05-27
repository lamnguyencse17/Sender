import React, { Component } from "react";
import ChatLog from "./ChatLog";
import ChatHeaders from "./ChatHeaders/ChatHeaders";
import PropTypes from "prop-types";

class MessageAreaContainer extends Component {
  render() {
    let { activeTab, roomList, profile } = this.props;
    let participants, log, roomId;
    if (activeTab) {
      roomId = Object.keys(roomList).filter(
        (id) => roomList[id].title == activeTab
      )[0];
      let targetRoom =
        roomList[
          Object.keys(roomList).filter(
            (id) => roomList[id].title == activeTab
          )[0]
        ];
      participants = targetRoom.participants;
      log = targetRoom.messages;
    }
    return (
      <>
        {activeTab ? (
          <>
            <ChatHeaders
              activeTab={activeTab}
              participants={participants}
              roomId={roomId}
              updateOnUserLeave={this.props.updateOnUserLeave}
            />
            <ChatLog log={log} profile={profile} participants={participants} />
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}

MessageAreaContainer.propTypes = {
  activeTab: PropTypes.string.isRequired,
  roomList: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      messages: PropTypes.objectOf(
        PropTypes.shape({
          message: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
          owner: PropTypes.string.isRequired,
          room: PropTypes.string.isRequired,
        })
      ).isRequired,
      participants: PropTypes.objectOf(
        PropTypes.shape({
          email: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          gravatar: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    })
  ),
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    gravatar: PropTypes.string.isRequired,
  }).isRequired,
};

export default MessageAreaContainer;
