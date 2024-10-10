import mongoose from "mongoose";
import Address from "../modals/addressModal.js";

export const fetchAddress = async (req, res) => {
  try {
    const address = await Address.find({});
    if (address.length > 0) {
      return res.status(200).json({
        message: "Address fetched successfully",
        success: true,
        data: address,
      });
    } else {
      return res.status(404).json({
        message: "No address found",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const singleAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);
    if (address) {
      return res.status(200).json({
        message: "Address fetched successfully",
        success: true,
        data: address,
      });
    } else {
      return res.status(404).json({
        message: "Address Not Found with this Id !",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
export const createAddress = async (req, res) => {
  try {
    const {
      name,
      contactName,
      address,
      street1,
      street2,
      city,
      state,
      country,
      pincode,
    } = req.body;

    if (
      !name ||
      !contactName ||
      !address ||
      !street1 ||
      !city ||
      !state ||
      !country ||
      !pincode
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
        success: false,
      });
    }

    // Pincode validation (should be exactly 6 digits)
    if (pincode.toString().length !== 6) {
      return res.status(400).json({
        message: "Pincode must be exactly 6 digits",
        success: false,
      });
    }

    // Check if the address with the same pincode already exists
    const existingAddress = await Address.findOne({ pincode });
    if (existingAddress) {
      return res.status(400).json({
        message: "Address with this pincode already exists",
        success: false,
      });
    }

    const newAddress = new Address({
      name,
      contactName,
      address,
      street1,
      street2,
      city,
      state,
      country,
      pincode,
    });

    const saveAddress = await newAddress.save();
    return res.status(200).json({
      message: "Address created successfully",
      success: true,
      data: saveAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const editAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Address ID",
        success: false,
      });
    }

    const existingAddress = await Address.findById(id);
    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
      });
    }

    const {
      name,
      contactName,
      address,
      street1,
      street2,
      city,
      state,
      country,
      pincode,
    } = req.body;

    // Check if pincode is being updated and if it already exists
    if (pincode && pincode !== existingAddress.pincode) {
      if (pincode.toString().length !== 6) {
        return res.status(400).json({
          message: "Pincode must be exactly 6 digits",
          success: false,
        });
      }

      const addressWithSamePincode = await Address.findOne({ pincode });
      if (addressWithSamePincode) {
        return res.status(400).json({
          message: "Address with this pincode already exists",
          success: false,
        });
      }
    }

    // Update the address with the new data or keep old data if not provided
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        name: name || existingAddress.name,
        contactName: contactName || existingAddress.contactName,
        address: address || existingAddress.address,
        street1: street1 || existingAddress.street1,
        street2: street2 || existingAddress.street2,
        city: city || existingAddress.city,
        state: state || existingAddress.state,
        country: country || existingAddress.country,
        pincode: pincode || existingAddress.pincode,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Address updated successfully",
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteSingleAddres = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Address ID",
        success: false,
      });
    }

    const existingAddress = await Address.findById(id);
    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
      });
    }

    await Address.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Address deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteAll = async (req, res) => {
  try {
    const result = await Address.deleteMany();
    return res.status(200).json({
      message: "All addresses deleted successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
