import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService],
  imports: [AuthModule, FilesModule, CloudinaryModule],
  exports: [RecipesService],
})
export class RecipesModule {}
