import { Injectable } from '@nestjs/common';

import { RecipesService } from '../recipes/recipes.service';
import { AuthService } from 'src/auth/auth.service';

import { initialData } from './data/seed.data';
import { PrismaClient } from '@prisma/client';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class SeedService {
  private readonly prismaClient = new PrismaClient();

  constructor(
    private readonly recipesService: RecipesService,
    private readonly authService: AuthService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async runSeed() {
    try {
      //* Delete tables.
      await this.deleteTables();

      //* Insert Users
      const users: string[] = await this.insertUsers();

      //*Inset Categories
      const categories: string[] = await this.insertCategories();

      //* Inset Recipes
      await this.insertRecipes(users, categories);

      return 'Seed Executed Successfully';
    } catch (error) {
      throw error;
    }
  }

  private async deleteTables() {
    try {
      await Promise.all([
        await this.prismaClient.user.deleteMany({}),
        await this.prismaClient.recipe.deleteMany({}),
        await this.prismaClient.category.deleteMany({}),
        await this.prismaClient.favorite.deleteMany({}),
      ]);
    } catch (error) {
      throw error;
    }
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users = await Promise.all(
      seedUsers.map((user) => this.authService.create(user)),
    );

    return users.map((usr) => usr.id);
  }

  private async insertRecipes(users: string[], categories: string[]) {
    const seedRecipes = initialData.recipes;

    seedRecipes.forEach(async (recipe) => {
      const userRandom = Math.floor(Math.random() * 5);
      const categoryRandom = Math.floor(Math.random() * categories.length);

      const newRecipe = {
        ...recipe,
        categoryId: categories[categoryRandom],
      };

      await this.recipesService.create(users[userRandom], newRecipe);
    });
  }

  private async insertCategories() {
    const seedCategories = initialData.categories;

    const categories = await Promise.all(
      seedCategories.map((category) => this.categoriesService.create(category)),
    );

    return categories.map((c) => c.id);
  }
}
