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
import { UploadApiResponse } from 'cloudinary';

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
    file?: UploadApiResponse,
  ) {
    try {
      if (file) {
        createRecipeDto.image = file.url.replace('http', 'https');
      }

      const recipe = await this.recipe.create({
        data: {
          ...createRecipeDto,
          userId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
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
      const totalRecipes = await this.recipe.count();
      const recipes = await this.recipe.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip: offset,
        take: limit,
      });

      if (recipes.length === 0)
        throw new NotFoundException(['Recipes not found']);

      return {
        recipes,
        totalRecipes,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalRecipes / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllOwnRecipess(userId: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const totalRecipes = await this.recipe.count({ where: { userId } });
      const recipes = await this.recipe.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip: offset,
        take: limit,
      });

      if (recipes.length === 0)
        throw new NotFoundException([`This user has no recipes created`]);

      return {
        recipes,
        totalRecipes,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalRecipes / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllByUser(userId: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const totalRecipes = await this.recipe.count({ where: { userId } });
      const recipes = await this.recipe.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip: offset,
        take: limit,
      });

      if (recipes.length === 0)
        throw new NotFoundException([`This user has no recipes created`]);

      return {
        recipes,
        totalRecipes,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalRecipes / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  async findByCatagory(id: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const totalRecipes = await this.recipe.count({
        where: { categoryId: id },
      });
      const recipes = await this.recipe.findMany({
        where: { categoryId: id },
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip: offset,
        take: limit,
      });

      if (recipes.length === 0)
        throw new NotFoundException(['Recipes not found']);

      return {
        recipes,
        totalRecipes,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalRecipes / limit),
      };
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
          createdAt: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!recipe)
        throw new NotFoundException([`Recipe with id ${id} not found`]);

      return recipe;
    } catch (error) {
      throw error;
    }
  }

  async update(
    userId: string,
    id: string,
    updateRecipeDto: UpdateRecipeDto,
    file?: UploadApiResponse,
  ) {
    try {
      if (file) {
        updateRecipeDto.image = file.url.replace('http', 'https');
      }

      const recipe = await this.findOne(id);
      if (recipe.User.id !== userId)
        throw new UnauthorizedException([
          'You do not have permission to update this recipe',
        ]);

      const updatedRecipe = await this.recipe.update({
        where: { id: id },
        data: {
          ...updateRecipeDto,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
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
        throw new UnauthorizedException([
          'You do not have permission to delete this recipe',
        ]);

      await this.recipe.delete({ where: { id: id } });

      return {
        message: `Recipe with id ${id} has been deleted permanently`,
      };
    } catch (error) {
      throw error;
    }
  }

  async changeImage(id: string, userId: string, file: UploadApiResponse) {
    const { url } = file;
    try {
      const recipe = await this.findOne(id);
      if (recipe.User.id !== userId)
        throw new UnauthorizedException([
          'You are not allowed to update this account',
        ]);

      if (!file) throw new BadRequestException([`Image ${file} is not valid`]);

      const updatedUser = await this.recipe.update({
        where: { id: id },
        data: {
          image: url.replace('http', 'https'),
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
    const { title, description } = searchRecipeDto;

    try {
      const recipes = await this.recipe.findMany({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          ingredients: true,
          steps: true,
          image: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return recipes;
    } catch (error) {
      throw error;
    }
  }
}
