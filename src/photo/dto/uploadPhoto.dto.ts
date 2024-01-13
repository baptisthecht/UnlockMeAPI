import { IsNotEmpty, IsUrl } from 'class-validator';

export class uplaodPhotoDto {
  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly name: string;
}
