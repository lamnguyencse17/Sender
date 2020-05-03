import roomModel from "../models/rooms";
import messageModel from "../models/messages";
import userModel from "../models/users";

class socketHandler {
  constuctor() {
    this.socket = null;
    this.io = null;
    this.id = null;
  }
  setSocket = async (io, socket) => {
    this.io = io;
    this.socket = socket;
    this.id = socket.handshake.query["id"];
    console.log(`New client connected ${this.id}`);
    let rooms = await roomModel.getSubscribedRoom(this.id);
    let subscribedRooms = {};
    rooms.forEach((room) => {
      subscribedRooms = { ...subscribedRooms, [room._id]: room.title };
      socket.join(room._id);
    });
    socket.emit("subscribed-to", subscribedRooms);
    rooms.forEach((room) => {
      if (room.messages.length != 0) {
        socket.emit("FromAPI", lastMessages(room.messages, 5));
      }
    });
  };
  onClientSendingMessage = (message) => {
    // TODO: normalize to incoming-message of client
    console.log(message);
    this.io.sockets.in(message.room).emit("incoming-message", message);
    let newMessage = new messageModel({
      message: message.message,
      owner: mongoose.Types.ObjectId(message.owner),
      room: mongoose.Types.ObjectId("5eabfa02f209780629cd9dff"), //room goes herre later
    });
    newMessage.save((err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  };
  onDisconnect = () => {
    this.socket.leaveAll();
    if (this.socket.disconnected) {
      console.log("Client disconnected");
    }
  };
  onError = (err) => {
    console.log("Socket.IO Error");
    console.log(err.stack);
  };
}

const lastMessages = (messageList, n) => {
  if (messageList == null) return void 0;
  if (n == null) return messageList[messageList.length - 1];
  return messageList.slice(Math.max(messageList.length - n, 0));
};

var mockData = {
  id1: "Hello 1",
  id2: "Hello 2",
  id3: "Hello 3",
  id4: "Hello 4",
};

export default socketHandler;
