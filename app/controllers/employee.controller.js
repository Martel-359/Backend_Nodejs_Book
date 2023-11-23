import EmployeesService from "../services/employee.service.js";
import MongoDB from "../utils/mongodb.util.js";
import ApiError from "../api-error.js";


let createEmployee = async (req, res, next) => {
    if (!req.body?.HoTenNV) {
        return next(new ApiError(404, "Name can't be empty"));
    }
    try {
        const employeesService = new EmployeesService(MongoDB.client);
        const document = await employeesService.create(req.body);
        return res.send(document)
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error Create Employee"));
    }
}

let findAll = async (req,res,next) => {
    let documents=[];
    try {
        const employees= new EmployeesService(MongoDB.client);
        documents= await employees.find();
        res.send(documents);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500,"Can't find Employees!"));
    }
}

let updateEmployee = async (req,res,next) => {
    if(Object.keys(req.body).length===0){
        return next(new ApiError(400,"Data update require"));
    }
    try {
        const employees= new EmployeesService(MongoDB.client);
        const document= await employees.update(req.params.id,req.body);
        if(!document){
            console.log(req.params.id);
            return next(new ApiError(404,"Employee not found"));
        }
        return res.send({ message: "Employee updated successfully " });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500,`Update employee error ${req.params.id}`));
    }
}

let deleteEmployee= async (req,res,next) => {
    try{
        const employees= new EmployeesService(MongoDB.client);
        const document = await employees.delete(req.params.id);
        if(!document){
            return next(new ApiError(404,"Employee not found"));
        }
        return res.send({message:"Employee delete successfully"});
    }catch(error){
        return next (new ApiError(500,"Delete employee error"));
    }
}

// let findByMSNV= async (req,res,next) => {
//     try {
//         const employees= new EmployeesService(MongoDB.client);
//         const document = await employees.findOne(req.params.id);
//         if(!document){
//             return next (new ApiError(404,"Employee not found"));
//         }
//         res.send(document);
//     } catch (error) {
//         console.log(error);
//         return next(new ApiError(500,"Find MSNV errror"));
//     }
// }

let findById= async (req,res,next) => {
    try {
        const employees= new EmployeesService(MongoDB.client);
        const document = await employees.findById(req.params.id);
        if(!document){
            return next (new ApiError(404,"Employee not found"));
        }
        res.send(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500,"Find MSNV errror"));
    }

}
export default {
    createEmployee,
    findAll,
    updateEmployee,
    deleteEmployee,
    findById
}