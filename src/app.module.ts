import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ConfigModule.forRoot(), RecipesModule, AuthModule, UsersModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
