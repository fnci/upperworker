import dotenv from 'dotenv';
if(process.env.NODE_ENV !== 'production'){
    dotenv.config();
}
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'upperworker',
    allowedFormats: ['jpeg','jpg','png']
  }
});


export {storage, cloudinary}