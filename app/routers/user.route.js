import express from 'express';
import user from "../controllers/user.controller.js";

const router = express.Router();

router.route("/")
    .post(user.createUser)
    .get(user.findAll);
router.route("/:id")
    .get(user.getById)
    .put(user.updateUser)
    .delete(user.deleteUser);

export default router;