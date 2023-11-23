import express from "express";
import upload from "../controllers/upload.controller.js"

const router = express.Router();

router.route("/")
    .post(upload.uploadFiles)
    .get(upload.getListFiles);
router.route("/:MSHH")
    .get(upload.downloadbyMSHH);

export default router;
