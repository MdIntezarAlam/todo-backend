import mongoose from "mongoose";
import User from "../modals/userModal.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const user = await User.find();
    if (user) {
      return res.status(200).json({
        success: true,
        account: user,
      });
    } else {
      return res.status(404).json({
        message: "User not found",
        success: false,
        account: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, password, conPassword } = req.body;
    if (!name || !email || !password || !conPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== conPassword) {
      return res.status(400).json({
        message: "Password and Confirm Password should be same",
      });
    }

    const findEmail = await User.findOne({ email });
    if (findEmail) {
      return res.status(403).json({
        message: "Email Already Exists",
      });
    }
    const newUser = new User({ name, email, password, conPassword });
    const saveUser = await newUser.save();
    res.status(201).json({
      message: "User Signup Successfully!",
      success: true,
      account: saveUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const checkEmailAlreadyExist = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const findEmail = await User.findOne({ email });

    const isAccountExists = !!findEmail;
    return res.status(200).json({
      data: { isAccountExists },
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid User Id",
        success: false,
      });
    }
    const findId = await User.findById(id);
    if (!findId) {
      return res.status(404).json({
        message: "User Id Not Found!",
        success: false,
      });
    } else {
      const { name, email, password, conPassword } = req.body;
      const updateUser = await User.findByIdAndUpdate(id, {
        name,
        email,
        password,
        conPassword,
      });
      return res.status(200).json({
        message: "User updated successfully",
        success: true,
        account: updateUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid User Id",
        success: false,
      });
    }
    const findId = await User.findById(id);
    if (!findId) {
      return res.status(404).json({
        message: "User Id Not Found!",
        success: false,
      });
    } else {
      const deleteUser = await User.findByIdAndDelete(id);
      return res.status(200).json({
        message: "User deleted successfully",
        success: true,
        account: deleteUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      if (password === user.password) {
        //jwt takes 1.payload, 2.secretkey, 3.options
        let payloads = user["_id"];
        const JWT_SECRATE_KEY = process.env.JWT_SECRATE_KEY;
        const token = jwt.sign({ payloads }, JWT_SECRATE_KEY);
        console.log(token);
        //than save in to the cookie
        res.cookie("login", token, { httpOnly: true });

        //after that verify in protected route

        return res.status(200).json({
          message: "Login Successful",
          success: true,
          account: user,
        });
      } else {
        return res.status(404).json({
          message: "Invalid Credentials",
          success: false,
        });
      }
    } else {
      return res.status(404).json({
        message: "User does not exist",
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

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("login");
    return res.status(200).json({
      message: "Logout Successful",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
