import UserService from "../services/user.service.js";
import MongoDB from "../utils/mongodb.util.js";
import ApiError from "../api-error.js";


let createUser = async (req, res, next) => {
    if (!req.body.HoTenKH) {
        return next(new ApiError(404, "Name can't be empty"));
    }
    try {
        const user = new UserService(MongoDB.client);
        await user.create(req.body);
        return res.send({ message: "Create user successfully" })
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error creating user"));
    }
}

let findAll = async (req, res, next) => {
    let documents = [];
    try {
        const user = new UserService(MongoDB.client);
        const { HoTenKH } = req.query;
        if (HoTenKH) {
            documents = await user.findByName(HoTenKH);
        }
        else {
            documents = await user.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "Can't find user"));
    }
    return res.send(documents);
};

let updateUser = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update User required"));
    }
    try {
        const user = new UserService(MongoDB.client);
        const document = await user.update(req.params.id, req.body)
        if (!document) {
            return next(new ApiError(400, "User not found"));
        }
        return res.send({ message: "User updated successfully" });
    } catch (error) {
        return next(new ApiError(500, "Error updating user"))
    }
}

let deleteUser = async (req, res, next) => {
    try {
        const user = new UserService(MongoDB.client);
        const document = await user.delete(req.params.id)
        if (!document) {
            return next(new ApiError(400, "User not found"));
        }
        return res.send({ message: "User deleted successfully" });
    } catch (error) {
        return next(new ApiError(500, "Error deleting user"));

    }
}

let getById = async (req, res, next) => {
    try {
        const user = new UserService(MongoDB.client);
        const document = await user.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        console.log(document);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Error finding user"));
    }
}


export default {
    createUser,
    findAll,
    updateUser,
    deleteUser,
    getById
}


