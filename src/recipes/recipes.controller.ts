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
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(
    @Req() request: Express.Request,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    const userId = request.user['id'];

    return this.recipesService.create(userId, createRecipeDto);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get('by-user')
  @UseGuards(AuthGuard())
  findAllByUser(@Req() request: Express.Request) {
    const userId = request.user['id'];

    return this.recipesService.findAllByUser(userId);
  }

  @Get('by-category/:idCategory')
  findByCatagory(@Param('idCategory') idCategory: string) {
    return this.recipesService.findByCatagory(idCategory);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(
    @Req() request: Express.Request,
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    const userId = request.user['id'];

    return this.recipesService.update(userId, id, updateRecipeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Req() request: Express.Request, @Param('id') id: string) {
    const userId = request.user['id'];

    return this.recipesService.remove(userId, id);
  }
}
