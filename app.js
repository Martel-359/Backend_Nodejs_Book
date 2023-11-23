import express from 'express';
import cors from "cors";
import productsRouter from "./app/routers/product.route.js";
import usersRouter from "./app/routers/user.route.js";
import employeesRouter from './app/routers/employee.route.js';
import orderRouter from './app/routers/order.route.js';
import detailOrderRouter from './app/routers/detailOrder.route.js';
import uploadRouter from './app/routers/upload.route.js';
import authenRouter from './app/routers/authen.route.js';
import ApiError from './app/api-error.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/employees",employeesRouter);
app.use("/api/orders",orderRouter);
app.use("/api/details",detailOrderRouter);
app.use("/api/auth",authenRouter);
app.use("/api/uploads",uploadRouter);


app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"))
})

app.use((err, req, res, next) => {
    // Middleware xử lý lỗi tập trung.
    // Trong các đoạn code xử lý ở các route, gọi next(error)
    // sẽ chuyển về middleware xử lý lỗi này
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app;