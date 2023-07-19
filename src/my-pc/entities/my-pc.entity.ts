import { Prop, Schema } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class MyPc extends Document {
    @Prop({
        unique:true,
        index:true
    })
    nombre: string;

    @Prop()
    descripcion:string;

    @Prop()
    image:string;
    
    @Prop({ type: Types.ObjectId, ref: 'User' }) // Referencia al modelo de User
    user: Types.ObjectId;

}
