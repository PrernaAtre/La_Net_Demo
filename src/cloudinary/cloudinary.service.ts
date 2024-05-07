import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';


@Injectable()
export class CloudinaryService {
    constructor()
    {
        cloudinary.config({
            cloud_name:"dpo09oacb",
            api_key:"786639935253757",
            api_secret:"Kb_g4pC0NoI3dFwIwK3PXcqR7iM"
        })
    }

    async uploadProfileImage(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(filePath,{folder : 'profileImage'},
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            });
        //   streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      }

      async uploadIconImage(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(filePath,{folder : 'iconImage'},
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            });
        //   streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      }

      async uploadCoverImage(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(filePath,{folder : 'coverImage'},
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            });
        //   streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      }
}
