import roomModel from "../models/rooms";
import messageModel from "../models/messages";
import userModel from "../models/users";

class socketHandler {
  constuctor() {
    this.socket = null;
    this.io = null;
  }
  setSocket = async (io, socket) => {
    this.io = io;
    this.socket = socket;
    console.log(`New client connected ${socket.handshake.query["id"]}`);
    let rooms = await roomModel.getSubscribedRoom();
    for (let room in rooms) {
      let id = rooms[room];
      socket.join(id);
    }
    socket.emit("subscribed-to", rooms);
    Object.keys(mockData).forEach((index) => {
      socket.emit("FromAPI", {
        room: "5eabfa02f209780629cd9dff",
        id: index,
        message: mockData[index],
        owner: "5eabfa02f209780629cd9dfe",
        date: Date.now(),
      });
    });
  };
  onClientSendingMessage = (message) => {
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

var mockData = {
  id1: "Hello 1",
  id2: "Hello 2",
  id3: "Hello 3",
  id4: "Hello 4",
};

export default socketHandler;
