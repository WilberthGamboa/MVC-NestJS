import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Auth extends Document{

    @Prop()
    nombre:string;
    @Prop()
    apellido:string;
    @Prop()
    email:string;
    @Prop()
    password:string;
}
export const AuthSchema = SchemaFactory.createForClass(Auth);
