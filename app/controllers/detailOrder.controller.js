import MongoDB from "../utils/mongodb.util.js";
import ApiError from "../api-error.js";
import DetailOrderService from "../services/detailOrder.service.js";

let createDetailOrder = async (req, res, next) => {
    if (!req.body?.SoDonHang) {
        return next(new ApiError(404, "SoDonHang can't empty"))
    }
    try {
        const detailOrder = new DetailOrderService(MongoDB.client);
        const document = await detailOrder.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Error create detailOrder"));
    }
}

let findAll = async (req, res, next) => {
    try {
        const detailOrder = new DetailOrderService(MongoDB.client);
        const document = await detailOrder.find();
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Error find detailOrder"));
    }
}

let findBySoDonHang = async (req, res, next) => {
    try {
        const detailOrder = new DetailOrderService(MongoDB.client);
        const document = await detailOrder.findBySoDonHang(req.params.id);
        if (!document) {
            return next(new ApiError(404, "DetaiOrder not found"))
        }
        return res.send(document);
    } catch (error) {
        console.log(error);
        next(new ApiError(500, `Error find DetailOrder with SoDonhang: ${req.params.id}`));
    }
}

let updateDetailOrder = async (req, res, next) => {
    if (!Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update require"));
    }
    try {
        const detailOrder = new DetailOrderService(MongoDB.client);
        const document = await detailOrder.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "DetailOrder not found"));
        }
        return res.send({ message: "DetailOrder updated successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error updating detailOrder with SoDonHang:${req.params.id}`))
    }
}

let deleteDetailOrder = async (req, res, next) => {
    try {
        const detailOrder = new DetailOrderService(MongoDB.client);
        const document = await detailOrder.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "DetailOrder not found"));
        }
        return res.send({ message: "DetailOrder deleted successfully" });
    } catch (error) {
        return next(new ApiError(500, `Error deleting detailOrder with SoDonHang:${req.params.id}`));
    }
}

export default {
    createDetailOrder,
    findAll,
    findBySoDonHang,
    updateDetailOrder,
    deleteDetailOrder,
}