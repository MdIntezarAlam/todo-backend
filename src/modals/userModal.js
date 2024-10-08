import mongoose from "mongoose";
import validator from "email-validator";
import bcrypt from "bcrypt";

const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: function () {
      return validator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  conPassword: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: function () {
      return this.conPassword === this.password;
    },
  },
  //user role
  // role: {
  //   type: String,
  //   enum: ["admin", "user", "resturent", "deliveryBoy"],
  //   default: "user",
  // },
  // profileImage: {
  //   type: String,
  //   default: "img/users/default.jepeg",
  // },
});

//which mens that password and confirm password should be same
//and no nedd to save in db the confirm password
userShema.pre("save", function () {
  this.conPassword = undefined;
});

// userShema.pre("save", async function () {
//   let salt = await bcrypt.genSalt();
//   let hashedString = await bcrypt.hash(this.password, salt);
//   // console.log(hashedString);
//   //save it in to password
//   this.password = hashedString;

//   //compare
// });

const User = mongoose.model("User", userShema);

export default User;
