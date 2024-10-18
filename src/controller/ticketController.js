import mongoose from "mongoose";
import Ticket from "../modals/ticketModal.js";

export const ticketController = async (req, res) => {
  try {
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

    const findreasonType = await Ticket.findOne({ reasonType });
    if (findreasonType) {
      return res.status(400).json({
        message: "reasonType already exists",
        success: false,
      });
    } else {
      const newTicket = new Ticket({
        subject,
        description,
        reasonType,
      });

      const saveRoom = await newTicket.save();
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

export const fetchTickets = async (req, res) => {
  try {
    const findTicket = await Ticket.find();
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

export const fetchSingleTicket = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Ticket Id",
        success: false,
      });
    }
    // const findTicket = await Ticket.findById(id).select("reasonType");
    const findTicket = await Ticket.findById(id).select("reasonType");
    if (findTicket) {
      return res.status(200).json({
        message: "Ticket fetched successfully",
        success: true,
        data: findTicket,
      });
    } else {
      return res.status(404).json({
        message: "Ticket not found with this Id",
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
