import express from 'express';
import detaiOrder from '../controllers/detailOrder.controller.js';

const router= express.Router();

router.route('/')
    .get(detaiOrder.findAll)
    .post(detaiOrder.createDetailOrder);
router.route('/:id')
    .get(detaiOrder.findBySoDonHang)
    .put(detaiOrder.updateDetailOrder)
    .delete(detaiOrder.deleteDetailOrder);

export default router;