import { Injectable } from '@nestjs/common';

import { RecipesService } from '../recipes/recipes.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from '../users/users.service';

import { initialData } from './data/seed.data';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SeedService {
  private readonly prismaClient = new PrismaClient();

  constructor(
    private readonly recipesService: RecipesService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async runSeed() {
    try {
      let users: string[] = [];
      //* Delete tables.
      await this.deleteTables();

      //* Insert Users
      users = await this.insertUsers();

      //*Inset Categories

      //* Inset Recipes
      await this.insertRecipes(users);

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
        // await this.prismaClient.category.deleteMany({});
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

  private async insertRecipes(users: string[]) {
    const seedRecipes = initialData.recipes;

    seedRecipes.forEach(async (recipe) => {
      const userRandom = Math.floor(Math.random() * 5);

      await this.recipesService.create(users[userRandom], recipe);
    });
  }

  //TODO: Agregar datos para la categoría
}
