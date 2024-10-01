import mongoose from "mongoose";
import { stateEnumValues } from "../../helper/state.js";

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  street1: {
    type: String,
    required: true,
  },
  street2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
    enum: stateEnumValues,
  },

  country: {
    type: String,
    required: true,
    default: "India",
  },
  pincode: {
    type: Number,
    required: true,
  },
});

const Address = mongoose.model("Address", addressSchema);
export default Address;
