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

  create(createRecipeDto: CreateRecipeDto) {
    //TODO: Validar y mejorar esta creación
    const { title, description, createdBy, ingredients, steps, image } =
      createRecipeDto;

    return this.recipe.create({ data: createRecipeDto });
  }

  findAll() {
    return this.recipe.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
