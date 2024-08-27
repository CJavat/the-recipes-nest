import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaClient } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';

@Injectable()
export class RecipesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('RecipesService');

  constructor(private readonly filesService: FilesService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected Successfully');
  }

  async create(
    userId: string,
    createRecipeDto: CreateRecipeDto,
    file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        const { secureUrl } = this.filesService.uploadFile(file);
        createRecipeDto.image = secureUrl.split('/').at(-1);
      }

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

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const recipes = await this.recipe.findMany({
        // include: { User: true },
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        skip: offset,
        take: limit,
      });

      if (recipes.length === 0)
        throw new NotFoundException('Recipes not found');

      return recipes;
    } catch (error) {
      throw error;
    }
  }

  async findAllByUser(userId: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const recipes = await this.recipe.findMany({
        where: { userId },
        include: { User: true },
        skip: offset,
        take: limit,
      });

      if (recipes.length === 0)
        throw new NotFoundException(`This user has no recipes created`);

      return recipes;
    } catch (error) {
      throw error;
    }
  }

  async findByCatagory(id: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const recipes = await this.recipe.findMany({
        where: { categoryId: id },
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        skip: offset,
        take: limit,
      });

      if (recipes.length === 0)
        throw new NotFoundException('Recipes not found');

      return recipes;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const recipe = await this.recipe.findUnique({
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!recipe)
        throw new NotFoundException(`Recipe with id ${id} not found`);

      return recipe;
    } catch (error) {
      throw error;
    }
  }

  async update(userId: string, id: string, updateRecipeDto: UpdateRecipeDto) {
    try {
      const recipe = await this.findOne(id);
      if (recipe.User.id !== userId)
        throw new UnauthorizedException(
          'You do not have permission to update this recipe',
        );

      const updatedRecipe = await this.recipe.update({
        where: { id: id },
        data: {
          ...updateRecipeDto,
          updatedAt: new Date(),
        },
      });

      return updatedRecipe;
    } catch (error) {
      throw error;
    }
  }

  async remove(userId: string, id: string) {
    try {
      const recipe = await this.findOne(id);
      if (recipe.User.id !== userId)
        throw new UnauthorizedException(
          'You do not have permission to delete this recipe',
        );

      await this.recipe.delete({ where: { id: id } });

      return {
        message: `Recipe with id ${id} has been deleted permanently`,
      };
    } catch (error) {
      throw error;
    }
  }

  async changeImage(id: string, userId: string, file: Express.Multer.File) {
    try {
      const recipe = await this.findOne(id);
      if (recipe.User.id !== userId)
        throw new UnauthorizedException(
          'You are not allowed to update this account',
        );

      if (!file) throw new BadRequestException(`Image ${file} is not valid`);

      const { secureUrl } = this.filesService.uploadFile(file);
      const image = secureUrl.split('/').at(-1);

      const updatedUser = await this.recipe.update({
        where: { id: id },
        data: {
          image: image,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          userId: true,
          Category: {
            select: {
              name: true,
            },
          },
        },
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async searchRecipe(searchRecipeDto: SearchRecipeDto) {
    const { title, description, limit, offset } = searchRecipeDto;

    try {
      const recipes = await this.recipe.findMany({
        where: {
          AND: [
            {
              title: {
                contains: title,
                mode: 'insensitive', // Búsqueda insensible a mayúsculas y minúsculas
              },
            },
            {
              description: {
                contains: description,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip: offset,
        take: limit,
      });

      return recipes;
    } catch (error) {
      throw error;
    }
  }
}
