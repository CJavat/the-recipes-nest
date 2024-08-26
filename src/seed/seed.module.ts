import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { RecipesModule } from 'src/recipes/recipes.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AuthModule, UsersModule, RecipesModule, CategoriesModule],
})
export class SeedModule {}
