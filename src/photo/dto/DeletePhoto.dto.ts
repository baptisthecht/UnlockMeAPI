import { IsInt, IsNotEmpty } from 'class-validator';

export class DeletePhotoDto {
  @IsNotEmpty()
  @IsInt()
  photoId: number;
}
