import React, { Component } from "react";
import ChatLog from "./ChatLog";
import ChatHeaders from "./ChatHeaders/ChatHeaders";

export default class MessageAreaContainer extends Component {
  render() {
    let { activeTab, roomList, profile } = this.props;
    return (
      <>
        <ChatHeaders activeTab={activeTab} />
        {activeTab ? (
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
        ) : (
          <></>
        )}
      </>
    );
  }
}
