import { ObjectId } from "mongodb";

class ProductServices {
    constructor(client) {
        this.Product = client.db().collection("Products");

    }

    extractProductData(payload) {
        const product = {
            MaSoHH: payload.MaSoHH,
            TenHH: payload.TenHH,
            MoTaHH: payload.MoTaHH,
            Gia: payload.Gia,
            SoLuongHang: payload.SoLuongHang,
            GhiChu: payload.GhiChu
        };

        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );
        return product;
    }

    async create(payload) {
        const product = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(
            product,
            { $set: product },
            { returnDocument: "after", upsert: true }

        )
        return result.value;
    }

    async find() {
        const cursor = await this.Product.find();
        return cursor.toArray();
    }

    async findByName(name) {
        const cursor = await this.Product.find({
            TenHH: { $regex: new RegExp(name), $options: "i" },
        });
        return cursor.toArray();
    }

    async findById(id) {
        const result = await this.Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;

    }

    async findByMaSoHH(MaSoHH) {
        const result = await this.Product.findOne({
            MaSoHH: MaSoHH
        });
        return result;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        )
        return result.value;
    }

    async delete(id) {
        const result = await this.Product.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }



}

export default ProductServices;