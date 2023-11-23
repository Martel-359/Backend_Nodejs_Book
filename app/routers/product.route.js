import express from 'express';
import product from "../controllers/product.controller.js"

const router = express.Router();

router.route("/")
    .get(product.findAll)
    .post(product.createProduct);

router.route("/:id")
    .put(product.updateProduct)
    .delete(product.deleteProduct)
    .get(product.findById);

router.route('/find/:MSHH')
    .get(product.findByMSHH);

export default router;
