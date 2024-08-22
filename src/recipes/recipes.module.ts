import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService],
  imports: [AuthModule],
})
export class RecipesModule {}
