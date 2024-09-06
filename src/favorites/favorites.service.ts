import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FavoritesService {
  private readonly prismaClient = new PrismaClient();

  async createFavorite(id: string, userId: string) {
    try {
      if (!id) throw new BadRequestException(['id is required']);

      const recipe = await this.prismaClient.recipe.findUnique({
        where: { id: id },
      });
      if (!recipe) throw new NotFoundException(['Recipe not found']);

      const favorite = await this.prismaClient.favorite.create({
        data: {
          recipeId: id,
          userId: userId,
        },
      });
      if (!favorite) throw new BadRequestException(['An error has occurred']);

      return {
        ok: true,
        message: 'Favorite created successfully',
      };
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException([
          'The recipe already exists in the favorites list',
        ]);

      throw error;
    }
  }

  async deleteFavorite(id: string, userId: string) {
    try {
      if (!id) throw new BadRequestException(['id is required']);

      const favoriteResponse = await this.prismaClient.favorite.findUnique({
        where: {
          userId_recipeId: {
            userId: userId,
            recipeId: id,
          },
        },
      });
      if (!favoriteResponse) throw new NotFoundException(['Recipe not found']);

      const favorite = await this.prismaClient.favorite.delete({
        where: {
          userId_recipeId: {
            userId: userId,
            recipeId: id,
          },
        },
      });
      if (!favorite) throw new BadRequestException(['An error has occurred']);

      return {
        ok: true,
        message: 'Favorite removed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getFavorites(userId: string) {
    try {
      const favoriteRecipes = await this.prismaClient.favorite.findMany({
        where: { userId: userId },
        select: {
          id: true,
          createdAt: true,
          recipeId: true,
          userId: true,
          recipe: {
            select: {
              id: true,
              title: true,
              image: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
            },
          },
        },
      });
      if (favoriteRecipes.length === 0) return [];

      return favoriteRecipes;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
