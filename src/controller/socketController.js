import Message from "../modals/MessageController.js";

export const socketConnectionController = async (io) => {
  try {
    io.on("connection", (socket) => {
      console.log(`User Connected: ${socket.id}`);
      socket.on("join_room", async (room) => {
        socket.join(room);
        try {
          const messages = await Message.find({ room });
          socket.emit("load_messages", messages);
          console.log(
            `load old msg before Sending old messages to the user", ${messages}`
          );
        } catch (err) {
          console.error("Error while loading old messages: ", err);
        }
        console.log(`User with ID: ${socket.id} joined room: ${room}`);
      });

      socket.on("send_message", async (data) => {
        try {
          const newMessage = new Message({
            room: data.room,
            author: data.author,
            message: data.message,
            time: data.time,
          });
          await newMessage.save();
          socket.to(data.room).emit("receive_message", data);
          console.log("Send message to the user db", data);
        } catch (err) {
          console.error("Error saving message: ", err);
        }
      });
    });
  } catch (error) {
    console.log(error);
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  }
};
