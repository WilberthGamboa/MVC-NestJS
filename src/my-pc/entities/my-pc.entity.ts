import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class MyPc extends Document {
  @Prop({})
  nombre: string;

  @Prop()
  descripcion: string;

  @Prop()
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User' }) // Referencia al modelo de User
  user: Types.ObjectId;
}

export const MyPcSchema = SchemaFactory.createForClass(MyPc);
