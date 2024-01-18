// Modules
import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
// Services
import { PhotoService } from './photo.service';
// DTOs
import { uplaodPhotoDto } from './dto/uploadPhoto.dto';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get()
  health() {
    return this.photoService.health();
  }

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10000000 })],
      }),
    )
    file: Express.Multer.File,
    @Body() uplaodPhotoDto: uplaodPhotoDto,
    @Req() request: Request | any,
  ) {
    const userId = request.user['id'];
    return this.photoService.upload(
      file.originalname,
      file.buffer,
      uplaodPhotoDto,
      userId,
    );
  }

  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  async deletePhoto(@Req() request: Request | any) {
    const userId = request.user['id'];
    const photoId = request.params.photoId;
    return this.photoService.delete(photoId, userId);
  }

  @Get('get')
  async getPhoto(@Req() request: Request | any) {
    const photoId = request.params.photoId;
    return this.photoService.getByUuid(photoId);
  }
}
