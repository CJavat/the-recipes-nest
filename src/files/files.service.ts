import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../public', imageName);

    if (!existsSync(path))
      throw new BadRequestException([
        `Not product found with image ${imageName}`,
      ]);

    return path;
  }

  uploadFile(file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException(['Make sure that the file is an image']);

    const secureUrl = `${process.env.HOST_API}/files/recipe/${file.filename}`;

    return { secureUrl };
  }
}
