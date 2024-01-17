import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { uplaodPhotoDto } from './dto/uploadPhoto.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeletePhotoDto } from './dto/DeletePhoto.dto';

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
  async deletePhoto(
    @Body() deletePhotoDto: DeletePhotoDto,
    @Req() request: Request | any,
  ) {
    const userId = request.user['id'];
    return this.photoService.delete(deletePhotoDto, userId);
  }
}
