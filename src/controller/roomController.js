import Room from "../modals/roomModal.js";

export const roomController = async (req, res) => {
  try {
    // const { username, roomId } = req.body;
    const { subject, reasonType, description } = req.body;
    if (!subject) {
      return res.status(400).json({
        message: "subject is required",
        success: false,
      });
    }
    if (!description) {
      return res.status(400).json({
        message: "description is required",
        success: false,
      });
    }

    if (!reasonType) {
      return res.status(400).json({
        message: "reasonType is required",
        success: false,
      });
    }

    const findreasonType = await Room.findOne({ reasonType });
    if (findreasonType) {
      return res.status(400).json({
        message: "reasonType already exists",
        success: false,
      });
    } else {
      const newroom = new Room({
        subject,
        description,
        reasonType,
      });

      const saveRoom = await newroom.save();
      res.status(200).json({
        message: "Ticket created successfully",
        success: true,
        data: saveRoom,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const fetchRoomTickets = async (req, res) => {
  try {
    const findTicket = await Room.find();
    if (findTicket) {
      return res.status(200).json({
        message: "Tickets fetched successfully",
        success: true,
        data: findTicket,
      });
    } else {
      res.status(404).json({
        message: "No tickets found",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
