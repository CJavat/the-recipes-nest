import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RecipesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('RecipesService');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected Successfully');
  }

  async create(userId: string, createRecipeDto: CreateRecipeDto) {
    try {
      //TODO: Falta implementar la subida de imagenes.

      const recipe = await this.recipe.create({
        data: {
          ...createRecipeDto,
          userId,
        },
      });

      return recipe;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    try {
      return this.recipe.findMany();
    } catch (error) {
      throw error;
    }
  }

  findAllByUser(id: string) {
    return `Method findAllByUser not implemented: id: ${id}`;
  }

  findByCatagory(id: string) {
    return `Method findByCatagory not implemented: id: ${id}`;
  }

  findOne(id: string) {
    return `This action returns a #${id} recipe`;
  }

  update(userId: string, id: string, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(userId: string, id: string) {
    return `This action removes a #${id} recipe`;
  }
}
