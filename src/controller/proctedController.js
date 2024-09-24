import jwt from "jsonwebtoken";
export const proctedController = async (req, res, next) => {
  const JWT_SECRATE_KEY = process.env.JWT_SECRATE_KEY;
  try {
    if (req.cookies.login) {
      let isVerified = jwt.verify(req.cookies.login, JWT_SECRATE_KEY);
      if (isVerified) {
        next();
      } else {
        res.status(403).json({ message: "User Not Verified!" });
      }
    } else {
      res.status(403).json({ message: "Operation Not Allowed!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
