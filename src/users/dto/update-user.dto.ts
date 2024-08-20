import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { CreateUserDto } from 'src/auth/dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
