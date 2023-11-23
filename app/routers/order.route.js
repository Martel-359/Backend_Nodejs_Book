import express from 'express';
import order from "../controllers/order.controller.js";

const router= express.Router();

router.route("/")
    .get(order.findAll)
    .post(order.createOrder);

router.route("/:id")
    .put(order.updateOrder)
    .delete(order.deleteOrder)
    .get(order.findBySoDonHang);

export default router;