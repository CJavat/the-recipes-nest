import {
  Controller,
  Delete,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @UseGuards(AuthGuard())
  getFavorites(@Req() request: Express.Request) {
    const userId = request.user['id'];

    return this.favoritesService.getFavorites(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  createFavorite(@Req() request: Express.Request, @Param('id') id: string) {
    const userId = request.user['id'];

    return this.favoritesService.createFavorite(id, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteFavorite(@Req() request: Express.Request, @Param('id') id: string) {
    const userId = request.user['id'];

    return this.favoritesService.deleteFavorite(id, userId);
  }
}
