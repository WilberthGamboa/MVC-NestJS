import { PartialType } from '@nestjs/mapped-types';
import { CreateMyPcDto } from './create-my-pc.dto';

export class UpdateMyPcDto extends PartialType(CreateMyPcDto) {}
