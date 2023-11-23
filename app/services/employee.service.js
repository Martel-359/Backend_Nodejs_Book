import { ObjectId } from "mongodb";

class employeesService{
    constructor(client){
        this.Employee = client.db().collection("Employees");
    }

    extractEmployeeData(payload){
        const employee={
            MSNV:payload.MSNV,
            HoTenNV:payload.HoTenNV,
            Password:payload.Password,
            ChucVu:payload.ChucVu,
            DiaChi:payload.DiaChi,
            SoDienThoai:payload.SoDienThoai
        }
        Object.keys(employee).forEach(
            (key) => employee[key] === undefined && delete employee[key]
        );
        return employee;
    }

    async login(SoDienThoai,Password){
        const result = await this.Employee.findOne(
            {
                SoDienThoai:SoDienThoai,
                Password:Password
            }
        );
        return result;
    }

    async create(payload){
        const employee = this.extractEmployeeData(payload);
        const result = this.Employee.findOneAndUpdate(
            employee,
            {$set:employee},
            {returnDocument:"after",upsert:true}
        );
        return result.value;
    }

    async find() {
        const cursor = await this.Employee.find();
        return cursor.toArray();
    }

    async findOne(MSNV){
        const result = await this.Employee.findOne(
            {MSNV:MSNV}
        )
        return result;
    }

    async findById(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const result = await this.Employee.findOne(filter);
        return result;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractEmployeeData(payload);
        const result = await this.Employee.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        )
        return result.value;
    }

    async delete(id){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const result = await this.Employee.findOneAndDelete(filter);
        return result.value;
    }
}

export default employeesService;