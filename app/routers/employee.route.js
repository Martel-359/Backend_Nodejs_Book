import express from "express";
import employees from "../controllers/employee.controller.js"

const router = express.Router();

router.route("/")
    .get(employees.findAll)
    .post(employees.createEmployee);
router.route("/:id")
    .put(employees.updateEmployee)
    .delete(employees.deleteEmployee)
    .get(employees.findById);

export default router;