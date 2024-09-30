import express from "express";
import {
  checkEmailAlreadyExist,
  deleteUser,
  getUser,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
} from "../controller/userController.js";
import { protectedController } from "../controller/protectedController.js";

const router = express.Router();

router.route("/").get(protectedController, getUser);
router.route("/signup").post(signupUser);
router.post("/email", checkEmailAlreadyExist);
router.route("/update/:id").put(updateUser);
router.route("/delete/:id").delete(deleteUser);

router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
export default router;
