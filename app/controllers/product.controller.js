import ProductService from "../services/product.service.js";
import MongoDB from "../utils/mongodb.util.js";
import ApiError from "../api-error.js";

let createProduct = async (req, res, next) => {
    if (!req.body?.MaSoHH) {
        return next(new ApiError(404, "MaSoHH can't be empty"));
    }
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error creating product"));
    }
}

let updateProduct = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update required"))
    }
    try {
        const product = new ProductService(MongoDB.client);
        const document = await product.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send({ message: "Product updated successfully " });
    } catch (error) {
        return next(new ApiError(500, `Error updating product MaSoHH:${req.params.id}`));
    }
}

let deleteProduct = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send({ message: "Product deleted successfully" });
    } catch (error) {
        return next(new ApiError(500, `Error deleting product with MaSoHH:${req.params.id} `));
    }
}

let findAll = async (req, res, next) => {
    let documents = [];
    try {
        const productService = new ProductService(MongoDB.client);
        const { TenHH } = req.query;
        if (TenHH) {
            documents = await productService.findByName(TenHH);
        }
        else {
            documents = await productService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Can't find product")
        );
    }
    return res.send(documents);
};

let findById = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error getting product"))
    }
}

let findByMSHH = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findByMaSoHH(req.params.MSHH);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error getting product"))
    }
};

export default {
    createProduct,
    deleteProduct,
    updateProduct,
    findAll,
    findById,
    findByMSHH,
}
