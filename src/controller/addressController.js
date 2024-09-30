import mongoose from "mongoose";
import Address from "../modals/addressModal.js";

export const fetchAddress = async (req, res) => {
  try {
    const address = await Address.find({});
    if (address) {
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
    console.log(req.body);

    if (
      !name ||
      !contactName ||
      !address ||
      !street1 ||
      !street2 ||
      !city ||
      !state ||
      !country ||
      !pincode
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    if (pincode.toString().length !== 6) {
      return res.status(400).json({
        message: "Pincode must be exactly 6 digits",
        success: false,
      });
    }
    const existingAddress = await Address.findOne({ pincode });
    if (existingAddress) {
      return res.status(400).json({
        message: "Address with this pincode already exists",
        success: false,
      });
    }

    const adds = new Address({
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

    const saveAddress = await adds.save();
    return res.status(200).json({
      message: "Address created successfully",
      success: true,
      data: saveAddress,
    });
  } catch (error) {
    console.log(error);
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
        message: "Invalid Address Id",
        success: false,
      });
    }

    const findId = await Address.findById(id);
    if (!findId) {
      return res.status(404).json({
        message: "Address Id Not Found!",
        success: false,
      });
    } else {
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
      //  user update the pincode and different from the existing

      if (pincode && pincode !== findId.pincode) {
        const existingAddress = await Address.findOne({ pincode });
        if (existingAddress) {
          return res.status(400).json({
            message: "Address with this pincode already exists",
            success: false,
          });
        }
      }
      if (pincode.toString().length !== 6) {
        return res.status(400).json({
          message: "Pincode must be exactly 6 digits",
          success: false,
        });
      }

      const updatedAddress = await Address.findByIdAndUpdate(
        id,
        {
          name: name || findId.name,
          contactName: contactName || findId.contactName,
          address: address || findId.address,
          street1: street1 || findId.street1,
          street2: street2 || findId.street2,
          city: city || findId.city,
          state: state || findId.state,
          country: country || findId.country,
          pincode: pincode || findId.pincode,
        },
        { new: true } // Return the updated document
      );

      return res.status(200).json({
        message: "Address updated successfully",
        success: true,
        data: updatedAddress,
      });
    }
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
        message: "Invalid Address Id",
        success: false,
      });
    }
    const findId = await Address.findById(id);
    if (!findId) {
      return res.status(404).json({
        message: "Address Id Not Found!",
        success: false,
      });
    } else {
      const deleteAddress = await Address.findByIdAndDelete(id);
      return res.status(200).json({
        message: "Address deleted successfully",
        success: true,
        data: deleteAddress,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteAll = async (req, res) => {
  try {
    const delAdds = await Address.deleteMany();
    if (!delAdds) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
      });
    } else {
      return res.status(200).json({
        message: "All Address deleted successfully",
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
