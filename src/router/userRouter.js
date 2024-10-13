import express from "express";
import {
  changePasswordController,
  checkEmailAlreadyExist,
  deleteAccount,
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
router
  .route("/change-password/:id")
  .put(protectedController, changePasswordController);
router.route("/delete/:id").delete(deleteAccount);

router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
export default router;
