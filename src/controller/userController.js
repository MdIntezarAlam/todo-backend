import mongoose from "mongoose";
import User from "../modals/userModal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getUser = async ( req, res ) => {
  try
  {
    const userId = req.user.payloads;
    console.log( userId );
    const user = await User.findById( userId );

    if ( !user )
    {
      return res
        .status( 404 )
        .json( { message: "User not found", success: false } );
    }

    return res.status( 200 ).json( { user, success: true } );
  } catch ( error )
  {
    console.error( error );
    return res
      .status( 500 )
      .json( { message: "Internal Server Error", success: false } );
  }
};
export const signupUser = async ( req, res ) => {
  try
  {
    const { name, email, password, conPassword } = req.body;

    if ( !name || !email || !password || !conPassword )
    {
      return res
        .status( 400 )
        .json( { message: "All fields are required", success: false } );
    }

    if ( password !== conPassword )
    {
      return res
        .status( 400 )
        .json( { message: "Passwords do not match", success: false } );
    }

    const existingUser = await User.findOne( { email } );
    if ( existingUser )
    {
      return res
        .status( 400 )
        .json( { message: "Email already exists", success: false } );
    }

    const newUser = new User( {
      name,
      email,
      password,
    } );

    await newUser.save();

    return res.status( 201 ).json( {
      message: "User registered successfully",
      success: true,
      account: newUser,
    } );
  } catch ( error )
  {
    return res.status( 500 ).json( { message: error.message, success: false } );
  }
};

export const checkEmailAlreadyExist = async ( req, res ) => {
  try
  {
    const { email } = req.body;
    if ( !email )
    {
      return res.status( 400 ).json( {
        message: "Email is required",
        success: false,
      } );
    }

    const findEmail = await User.findOne( { email } );

    const isAccountExists = !!findEmail;
    return res.status( 200 ).json( {
      data: { isAccountExists },
      status: true,
    } );
  } catch ( error )
  {
    res.status( 500 ).json( {
      message: error.message,
      status: false,
    } );
  }
};

export const updateUser = async ( req, res ) => {
  try
  {
    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid( id ) )
    {
      return res.status( 400 ).json( {
        message: "Invalid User Id",
        success: false,
      } );
    }
    const findId = await User.findById( id );
    if ( !findId )
    {
      return res.status( 404 ).json( {
        message: "User Id Not Found!",
        success: false,
      } );
    } else
    {
      const { name, email, password, conPassword } = req.body;
      const updateUser = await User.findByIdAndUpdate( id, {
        name,
        email,
        password,
        conPassword,
      } );
      return res.status( 200 ).json( {
        message: "User updated successfully",
        success: true,
        account: updateUser,
      } );
    }
  } catch ( error )
  {
    res.status( 500 ).json( {
      message: error.message,
      success: false,
    } );
  }
};
export const changePasswordController = async ( req, res ) => {
  try
  {
    const { newPassword, conPassword } = req.body;

    if ( !newPassword || !conPassword )
    {
      return res
        .status( 400 )
        .json( { message: "All password fields are required", success: false } );
    }

    if ( newPassword !== conPassword )
    {
      return res.status( 400 ).json( {
        message: "New password and confirm password do not match",
        success: false,
      } );
    }

    const user = await User.findById( req.params.id );
    if ( !user )
    {
      return res
        .status( 404 )
        .json( { message: "User not found", success: false } );
    }

    const isMatch = await bcrypt.compare( oldPassword, user.password );
    if ( !isMatch )
    {
      return res
        .status( 400 )
        .json( { message: "Old Password is incorrect.", success: false } );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash( newPassword, saltRounds );

    await User.findByIdAndUpdate( user._id, { password: hashedPassword } );

    return res.status( 200 ).json( {
      message: "Password changed successfully",
      success: true,
      account: user,
    } );
  } catch ( error )
  {
    console.error( error );
    return res.status( 500 ).json( { message: error.message, success: false } );
  }
};

/*
export const loginUser = async ( req, res ) => {
  try
  {
    const { email, password } = req.body;
    if ( !email || !password )
    {
      return res
        .status( 400 )
        .json( { message: "All fields are required", success: false } );
    }

    const user = await User.findOne( { email } );
    if ( user && ( await bcrypt.compare( password, user.password ) ) )
    {
      const JWT_SECRATE_KEY = process.env.JWT_SECRATE_KEY;
      const token = jwt.sign( { payloads: user._id }, JWT_SECRATE_KEY, {
        expiresIn: "1h",
      } );

      res.cookie( "login", token, { httpOnly: true } );

      return res.status( 200 ).json( {
        message: "Login Successful",
        success: true,
        account: user,
        token,
      } );
    } else
    {
      return res
        .status( 401 )
        .json( { message: "Invalid Credentials", success: false } );
    }
  } catch ( error )
  {
    console.error( error );
    return res
      .status( 500 )
      .json( { message: "Internal Server Error", success: false } );
  }
};
*/
export const loginUser = async ( req, res ) => {
  try
  {
    const { email, password } = req.body;
    if ( !email || !password )
    {
      return res.status( 400 ).json( { message: "All fields are required", success: false } );
    }

    const user = await User.findOne( { email } );
    if ( user && ( await bcrypt.compare( password, user.password ) ) )
    {
      const JWT_SECRET_KEY = process.env.JWT_SECRATE_KEY;
      const token = jwt.sign( { payload: user._id }, JWT_SECRET_KEY, { expiresIn: "1h" } );

      // Set the cookie with additional settings for security and cross-origin compatibility
      res.cookie( "login", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensures secure only in production
        sameSite: "None", // Allows cross-origin cookies
        maxAge: 3600000, // 1 hour in milliseconds
      } );

      return res.status( 200 ).json( {
        message: "Login Successful",
        success: true,
        account: user,
      } );
    } else
    {
      return res.status( 401 ).json( { message: "Invalid Credentials", success: false } );
    }
  } catch ( error )
  {
    console.error( error );
    return res.status( 500 ).json( { message: "Internal Server Error", success: false } );
  }
};


export const deleteAccount = async ( req, res ) => {
  try
  {
    const { password, deleteType } = req.body;

    if ( !password )
    {
      return res.status( 400 ).json( {
        message: "Password is required",
        success: false,
      } );
    }

    if ( deleteType !== "DELETE_MY_ACCOUNT" )
    {
      return res.status( 400 ).json( {
        message: "Enter DELETE_MY_ACCOUNT",
        success: false,
      } );
    }

    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid( id ) )
    {
      return res.status( 400 ).json( {
        message: "Invalid User Id",
        success: false,
      } );
    }

    const user = await User.findById( id );
    if ( !user )
    {
      return res.status( 404 ).json( {
        message: "User Id Not Found!",
        success: false,
      } );
    }

    const isMatch = await bcrypt.compare( password, user.password );
    if ( !isMatch )
    {
      return res.status( 400 ).json( {
        message: "Password is incorrect",
        success: false,
      } );
    }

    await User.findByIdAndDelete( id );
    return res.status( 200 ).json( {
      message: "Account deleted successfully",
      success: true,
      account: user,
    } );
  } catch ( error )
  {
    res.status( 500 ).json( {
      message: error.message,
      success: false,
    } );
  }
};
export const logoutUser = async ( req, res ) => {
  try
  {
    res.clearCookie( "login" );
    return res.status( 200 ).json( {
      message: "Logout Successful",
      success: true,
    } );
  } catch ( error )
  {
    res.status( 500 ).json( {
      message: error.message,
      success: false,
    } );
  }
};
