import { ObjectId } from "mongodb";

class OrderServices{
    constructor(client){
        this.Order = client.db().collection("Orders");
    }

    extractOrderData(payload){
        const order={
            SoDonHang:payload.SoDonHang,
            MSKH:payload.MSKH,
            MSNV:payload.MSNV,
            NgayDH:payload.NgayDH,
            TrangThaiDH:payload.TrangThaiDH
        }

        Object.keys(order).forEach(
            (key) => order[key]=== undefined && delete order[key]
            
        );
        return order;
    }

    async create(payload){
        const order = this.extractOrderData(payload);
        const result = await this.Order.findOneAndUpdate(
            order,
            {$set:order},
            {returnDocument:"after",upsert:true}
        )
        return result.value;
    }

    async find(){
        const cursor = await this.Order.find();
        return cursor.toArray();
    }

    async findById(SoDonHang){
        const result= await this.Order.findOne(
            {SoDonHang:SoDonHang}
        )
        return result;
    }


    async updateBySoDonHang(SoDonHang, payload) {
        const order = this.extractOrderData(payload);
        const result = await this.Order.updateMany(
            { SoDonHang: SoDonHang },
            { $set: order }
        );
        return result.modifiedCount;
    }


    async delete(id){
        const result= await this.Order.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
}

export default OrderServices;