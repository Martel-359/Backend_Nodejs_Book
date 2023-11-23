import { ObjectId } from "mongodb";

class DetailOrderService{
    constructor(client){
        this.DetailOrder= client.db().collection("DetailOrders");
    }

    extractDetailOrderData(payload){
        const detailOrder= {
            SoDonHang:payload.SoDonHang,
            MSHH:payload.MSHH,
            TenHH:payload.TenHH,
            SoLuong:payload.SoLuong,
            GiaDatHang:payload.GiaDatHang,
            GiamGia:payload.GiamGia
        }

        Object.keys(detailOrder).forEach(
            (key) =>detailOrder[key] === undefined && delete DetailOrder[key]
        );

        return detailOrder;
    }

    async create(payload){
        const detailOrder = this.extractDetailOrderData(payload);
        const result = await this.DetailOrder.findOneAndUpdate(
            detailOrder,
            {$set:detailOrder},
            {returnDocument:"after",upsert:true}
        )
        return result;
    }

    async find(){
        const cursor = await this.DetailOrder.find();
        return cursor.toArray();
    }

    async findBySoDonHang(SoDonHang){
        const cursor = await this.DetailOrder.find({ SoDonHang: SoDonHang });
        const result = await cursor.toArray();
        console.log(result);
        return result;
    }

    async update(SoDonHang,payload){
        const filter = await this.DetailOrder.findOne(
            {SoDonHang:SoDonHang}
        )
        const result= await this.DetailOrder.findOneAndUpdate(
            filter,
            {$set:payload},
            {returnDocument:"after"}
        )
        return result.value;
    }

    async delete (SoDonHang){
        const result= await this.DetailOrder.findOneAndDelete(
            {SoDonHang:SoDonHang}
        )
        return result.value;
    }
}

export default DetailOrderService;