import express from "express";
import {
  checkEmailAlreadyExist,
  deleteUser,
  getUser,
  loginUser,
  signupUser,
  updateUser,
} from "../controller/userController.js";
import { proctedController } from "../controller/proctedController.js";

const router = express.Router();

router.route("/").get(proctedController, getUser);
router.route("/signup").post(signupUser);
router.post("/email", checkEmailAlreadyExist);
router.route("/update/:id").put(updateUser);
router.route("/delete/:id").delete(deleteUser);

router.route("/login").post(loginUser);
export default router;
