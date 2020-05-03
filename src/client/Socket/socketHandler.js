class socketHandler {
  constuctor() {
    this.socket = null;
  }
  setSocket = (socket) => {
    this.socket = socket;
  };
  subscribedRoom = (rooms) => {
    // rooms: {id: {title: participants}}
    //FIXME: the keys "id" is coming from nowhere!
    let defaultRoom = rooms[Object.keys(rooms)[0]].title;
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
  sendMessage = (message, roomId, profileId) => {
    this.socket.emit("client-sending-message", {
      room: roomId,
      message: message,
      owner: profileId,
    });
    console.log("SENT");
  };
}

export default socketHandler;
