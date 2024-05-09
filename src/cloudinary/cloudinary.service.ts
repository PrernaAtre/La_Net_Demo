import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';


@Injectable()
export class CloudinaryService {
    constructor(private readonly configService:ConfigService)
    {
        cloudinary.config({
            cloud_name:this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key:this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret:this.configService.get<string>('CLOUDINARY_API_SEARCH'),
        })
    }

    async uploadProfileImage(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(filePath,{folder : 'profileImage'},
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            });
        });
      }
}
