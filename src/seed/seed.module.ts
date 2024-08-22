import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AuthModule, UsersModule, RecipesModule],
  //TODO: Después importar el CategoryModule
})
export class SeedModule {}
