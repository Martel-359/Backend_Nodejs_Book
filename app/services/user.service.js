import { ObjectId } from "mongodb";

class UserService {
    constructor(client) {
        this.User = client.db().collection('Users');
    }

    extractDataUser(payload) {
        const user = {
            HoTenKH: payload.HoTenKH,
            Password: payload.Password,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
        }

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );

        return user;
    }

    async login(SoDienThoai, Password) {
        const result =await this.User.findOne(
            {
                SoDienThoai: SoDienThoai,
                Password: Password
            }
        );
        return result;
    }

    async create(payload) {
        const user = this.extractDataUser(payload);
        const result = await this.User.findOneAndUpdate(
            user,
            { $set: user },
            { returnDocument: "after", upsert: true }
        )
        return result;
    }

    async find() {
        const cursor = await this.User.find();
        return cursor.toArray();
    }

    async findById(id) {
        const result = await this.User.findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : null });
        return result;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const update = this.extractDataUser(payload);
        const result = await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        )
        return result.value;
    }

    async delete(id) {
        const result = await this.User.findOneAndDelete(
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : null, }
        )
        return result.value;
    }

}

export default UserService;
