import MongoDB from "../utils/mongodb.util.js";
import ApiError from "../api-error.js";
import OrderServices from "../services/order.service.js";

let createOrder = async (req, res, next) => {
    if(!req.body?.SoDonHang){
        return next(new ApiError(404,"SoDonHang can't be empty"));
    }
    try {
        const orderServices= new OrderServices(MongoDB.client);
        const document = await orderServices.create(req.body);
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500,"Error creating order"));
    }
}

let updateOrder = async (req, res, next) => {
    if(Object.keys(req.body).length===0){
        return next(new ApiError(400,"Data update require"));
    }
    try {
        const orderServices= new OrderServices(MongoDB.client);
        console.log(req.params.id);
        const document = await orderServices.updateBySoDonHang(req.params.id,req.body)
        if(!document){
            return next( new ApiError(404,"Order not found"));
        }
        return res.send({message:"Order update succes"});
    } catch (error) {
        return next (new ApiError(500,`Error update order SoDonHang: ${req.params.id}`));
    }
}

let deleteOrder = async (req, res, next) => {
    try {
        const orderServices = new OrderServices(MongoDB.client);
        const document = await orderServices.delete(req.params.id);
        if(!document){
            return next (new ApiError(404,"Order not found"));
        }
        return res.send({message:"Order deleted successfully"});
    } catch (error) {
        return next( new ApiError (500,`Error deleting order with SoDonHang:${req.params.id}`))
    }
}

let findAll = async (req, res, next) => {
    let documents=[];
    try {
        const orderServices = new OrderServices(MongoDB.client);
        documents= await orderServices.find();
        return res.send(documents);
    } catch (error) {
        return next ( new ApiError(500,"Can't find order"));
    }
}

let findBySoDonHang= async (req, res, next ) => {
    try {
        const orderServices = new OrderServices(MongoDB.client);
        const document = await orderServices.findById(req.params.id);
        if(!document){
            return next( new ApiError (404,"Order not found"));
        }
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next (new ApiError(500,"Error getting order"));
    }
}

export default {
    createOrder,
    updateOrder,
    deleteOrder,
    findAll,
    findBySoDonHang
}