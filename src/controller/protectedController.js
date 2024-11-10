import jwt from "jsonwebtoken";

export const protectedController = async ( req, res, next ) => {
  const JWT_SECRATE_KEY = process.env.JWT_SECRATE_KEY;
  try
  {
    if ( req.cookies.login )
    {
      const isVerified = jwt.verify( req.cookies.login, JWT_SECRATE_KEY );
      if ( isVerified )
      {
        req.user = isVerified;
        next();
      } else
      {
        res.status( 403 ).json( { message: "User Not Verified!" } );
      }
    } else
    {
      res
        .status( 403 )
        .json( {
          message: "UnAuthorized Access Operation Not Allowed! Please Login ",
        } );
    }
  } catch ( error )
  {
    console.log( error );
    res.status( 500 ).json( { message: error.message } );
    console.log( error );
  }
};
