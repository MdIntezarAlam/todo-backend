import Message from "../modals/MessageController.js";

export const socketConnectionController = (io) => {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", async (room) => {
      socket.join(room);
      // Retrieve from MongoDB and send it to the user
      try {
        const messages = await Message.find({ room });
        socket.emit("load_messages", messages); // Sending old messages to the user
      } catch (err) {
        console.error("Error loading messages: ", err);
      }

      console.log(`User with ID: ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", async (data) => {
      const newMessage = new Message({
        room: data.room,
        author: data.author,
        message: data.message,
        time: data.time,
      });
      try {
        await newMessage.save(); // Save the message to the database
        socket.to(data.room).emit("receive_message", data); // Send message to others in the room
      } catch (err) {
        console.error("Error saving message: ", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
};
