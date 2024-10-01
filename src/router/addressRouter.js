import express from "express";
import {
  createAddress,
  deleteAll,
  deleteSingleAddres,
  editAddress,
  fetchAddress,
} from "../controller/addressController.js";

const router = express.Router();

router.route("/fetch").get(fetchAddress);
router.route("/create").post(createAddress);
router.route("/update/:id").put(editAddress);
router.route("/delete/:id").delete(deleteSingleAddres);
router.route("/delete").delete(deleteAll);


export default router;
