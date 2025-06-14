import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// 🔐 Configure Cloudinary
cloudinary.config({
  cloud_name: 'dbqcl3gyu',
  api_key: '125497217998532',
  api_secret: 'w5UR9A2UgzujVlcuzmnOFRr56Bg'
});

// 📦 Set up storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Optional
    transformation: [{ width: 800, crop: 'limit' }]  // Optional
  }
});

// ✅ Multer upload middleware
export const upload = multer({ storage });
