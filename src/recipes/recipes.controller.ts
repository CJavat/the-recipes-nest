import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/files/helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from 'src/files/helpers/fileNamer.helper';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  async create(
    @Req() request: Express.Request,
    @Body() createRecipeDto: CreateRecipeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request.user['id'];

    if (!file) return this.recipesService.create(userId, createRecipeDto);

    const fileName = await this.cloudinaryService.uploadImage(file, 'recipes');

    if ('error' in fileName)
      throw new Error('Ha ocurrido un error al subir la foto');

    return this.recipesService.create(
      userId,
      createRecipeDto,
      fileName as UploadApiResponse,
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.recipesService.findAll(paginationDto);
  }

  @Get('own-recipes')
  @UseGuards(AuthGuard())
  findAllOwnRecipess(
    @Req() request: Express.Request,
    @Query() paginationDto: PaginationDto,
  ) {
    const userId = request.user['id'];

    return this.recipesService.findAllOwnRecipess(userId, paginationDto);
  }

  @Get('by-user/:id')
  findAllByUser(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.recipesService.findAllByUser(id, paginationDto);
  }

  @Get('by-category/:idCategory')
  findByCatagory(
    @Param('idCategory') idCategory: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.recipesService.findByCatagory(idCategory, paginationDto);
  }

  @Patch('change-image/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  async changeImage(
    @Req() request: Express.Request,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request.user['id'];

    const fileName = await this.cloudinaryService.uploadImage(file, 'recipes');

    if ('error' in fileName)
      throw new Error('Ha ocurrido un error al subir la foto');

    return this.recipesService.changeImage(
      id,
      userId,
      fileName as UploadApiResponse,
    );
  }

  @Get('search')
  searchRecipe(@Query() searchRecipeDto: SearchRecipeDto) {
    return this.recipesService.searchRecipe(searchRecipeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  async update(
    @Req() request: Express.Request,
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request.user['id'];

    if (!file) return this.recipesService.update(userId, id, updateRecipeDto);

    const fileName = await this.cloudinaryService.uploadImage(file, 'recipes');

    if ('error' in fileName)
      throw new Error('Ha ocurrido un error al subir la foto');

    return this.recipesService.update(
      userId,
      id,
      updateRecipeDto,
      fileName as UploadApiResponse,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Req() request: Express.Request, @Param('id') id: string) {
    const userId = request.user['id'];

    return this.recipesService.remove(userId, id);
  }
}
