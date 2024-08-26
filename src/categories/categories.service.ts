import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoriesService {
  private readonly prismaClient = new PrismaClient();

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prismaClient.category.create({ data: createCategoryDto });
  }

  async findAll() {
    return await this.prismaClient.category.findMany();
  }
}
