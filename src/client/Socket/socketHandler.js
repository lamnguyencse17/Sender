import { encapsulator } from "../Crypto/crypto";

/**
 * @class
 * Create a socketHandler Object to be passed around
 */
class socketHandler {
  constuctor() {
    this.socket = null;
  }
  /**
   * Set the socket for class socketHandler
   * @function
   * @param socket - socket object passed from this.socket in Message.js
   */
  setSocket = (socket) => {
    this.socket = socket;
  };
  /**
   * Get the list of rooms subscribed to
   * @function
   * @param {Object} rooms Received from socket to sync rooms
   * @param {Object} rooms.id ID of the room
   * @param {String} rooms.id.title Title of the room
   * @param {Array.<{_id: String, email: String, name: String}>} rooms.id.participants Array of participants
   * @returns {Object} An Object of defaultRoom and newRoom
   */
  subscribedRoom = (rooms) => {
    // rooms: {id: {title: participants}}
    //FIXME: the keys "id" is coming from nowhere!
    /**
     * @type {string}
     */
    let defaultRoom = rooms[Object.keys(rooms)[0]].title;
    /**
     * @namespace
     * @property {Object} id
     * @property {string} id.title
     * @property {array} id.participants
     * @property {Object} id.messages
     */
    let newRoom = {};
    //TEMP FIX:
    for (let id in rooms) {
      rooms[id].participants.forEach((participant) => {
        delete participant.id;
      });
      // key = id
      newRoom = {
        ...newRoom,
        [id]: {
          title: rooms[id].title,
          participants: rooms[id].participants.reduce(
            (obj, item) => ((obj[item._id] = item), obj),
            {}
          ),
          messages: {},
        },
      };
    }
    return { defaultRoom, newRoom };
  };
  /**
   * Sync messages between client and server
   * @function
   * @param {Array.<{_id: String, date: Date, message: String, owner: String, room: String}>} data - Received from socket
   * @param {Object} roomList this.state passed from component
   * @returns {Object.<{Object.<{date: Date, message: String, owner: String, room: String}>, target: String}>}
   */
  syncingMessages = (data, roomList) => {
    let returnedToState = {};
    data.forEach((message) => {
      returnedToState = {
        ...returnedToState,
        [message._id]: {
          date: message.date,
          message: message.message,
          owner: message.owner,
          room: message.room,
        },
      };
    });
    let target = null;
    for (let room in roomList) {
      if (data[0]["room"] == room) {
        target = room;
      }
    }
    return { returnedToState, target };
  };
  /**
   * Send the message to specified room
   * @function
   * @param {String} message - message needs sending
   * @param {String} roomId - room will be sent to
   * @param {String} profileId - owner of this message
   */

  sendMessage = async (message, roomId, profileId) => {
    let encapsulated = await encapsulator(
      {
        room: roomId,
        message: message,
        owner: profileId,
      },
    );
    this.socket.emit("client-sending-message", encapsulated);
    console.log("SENT");
  };
  leaveRoom = async (roomId) => {
    this.socket.emit("client-leave-room", roomId);
    console.log("LEAVE")
  }

}

export default socketHandler;
