import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary with hardcoded credentials
cloudinary.config({
  cloud_name: 'dbqcl3gyu', // Replace with your Cloudinary Cloud Name
  api_key: '125497217998532',       // Replace with your Cloudinary API Key
  api_secret: 'w5UR9A2UgzujVlcuzmnOFRr56Bg', // Replace with your Cloudinary API Secret
});

// Set storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4'], // Supports images and videos
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      return `${file.fieldname}-${uniqueSuffix}`;
    },
  },
});

export const upload = multer({ storage });
