import UserService from "../services/user.service.js";
import EmployeeService from "../services/employee.service.js";
import MongoDB from "../utils/mongodb.util.js";
import ApiError from "../api-error.js";

let login = async (req, res, next) => {
    const { SoDienThoai, Password } = req.body;
    try {
        const userService = new UserService(MongoDB.client);
        const employeeService = new EmployeeService(MongoDB.client);
        const result1 = await userService.login(SoDienThoai, Password);
        const result2 = await employeeService.login(SoDienThoai, Password);
        if (result1) {
            return res.send({ message: "Login success", role: "user" });
        }
        else if (result2) {
            return res.send({ message: "Login success", role: "admin" });
        }
        else {
            return res.send();
        }
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error login user"))
    }
}


export default {
    login
}