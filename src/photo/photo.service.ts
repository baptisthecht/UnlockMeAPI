import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PhotoService {
  constructor(private readonly configService: ConfigService) {}
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

  async upload(fileName: string, fileContent: Buffer) {
    await this.s3Client
      .send(
        new PutObjectCommand({
          Bucket: 'uploadme-nestjs',
          Key: fileName,
          Body: fileContent,
        }),
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}
