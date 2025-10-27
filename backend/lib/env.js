import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_SENDER: process.env.EMAIL_SENDER,
  EMAIL_SENDER_NAME: process.env.EMAIL_SENDER_NAME,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
