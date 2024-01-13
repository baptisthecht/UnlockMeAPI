import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { uplaodPhotoDto } from './dto/uploadPhoto.dto';

@Injectable()
export class PhotoService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow<string>(
        'AWS_SECRET_ACCESS_KEY',
      ),
    },
  });

  health() {
    return 'yes';
  }

  async upload(
    fileName: string,
    fileContent: Buffer,
    uplaodPhotoDto: uplaodPhotoDto,
    userId: number,
  ) {
    let uuid = uuidv4();
    let UniqueFileName = uuid + fileName;
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'uploadme-nestjs',
          Key: UniqueFileName,
          Body: fileContent,
        }),
      );
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }

    const uploadedPhoto = await this.prismaService.photo.create({
      data: {
        name: uplaodPhotoDto.name,
        price: uplaodPhotoDto.price,
        url: `https://uploadme-nestjs.s3.eu-west-3.amazonaws.com/${UniqueFileName}`,
        shareLink: `https://share.me/blabla`,
        priceForSeller: uplaodPhotoDto.price * 0.9,
        userId: userId,
      },
    });

    return {
      success: true,
      shareLink: uploadedPhoto.shareLink,
      url: uploadedPhoto.url,
    };
  }
}
