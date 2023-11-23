import express from 'express';
import authen from '../controllers/authen.controller.js';

const router = express.Router();

router.route("/")
    .post(authen.login);

export default router;