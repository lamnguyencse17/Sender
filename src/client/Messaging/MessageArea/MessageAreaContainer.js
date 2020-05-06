import React, { Component } from "react";
import ChatLog from "./ChatLog";
import ChatHeaders from "./ChatHeaders/ChatHeaders";
import PropTypes from "prop-types";

class MessageAreaContainer extends Component {
  render() {
    let { activeTab, roomList, profile } = this.props;
    return (
      <>
        {activeTab ? (
          <>
            <ChatHeaders
              activeTab={activeTab}
              participants={
                roomList[
                  Object.keys(roomList).filter(
                    (id) => roomList[id].title == activeTab
                  )
                ].participants
              }
            />
            <ChatLog
              log={
                roomList[
                  Object.keys(roomList).filter(
                    (id) => roomList[id].title == activeTab
                  )
                ].messages
              }
              profile={profile}
              participants={
                roomList[
                  Object.keys(roomList).filter(
                    (id) => roomList[id].title == activeTab
                  )
                ].participants
              }
            />
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
