import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // ← fixed the path

import connectDB from './db/index.js';
import { app } from './app.js';

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
