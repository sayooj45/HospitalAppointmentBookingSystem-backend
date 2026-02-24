import express, { json } from 'express'
import mongoose from 'mongoose';
import router from './Route/loginRoute.js';
import dotenv from 'dotenv'
import admin from './Route/adminRoute.js';
import cors from 'cors'

dotenv.config()

const app = express();
app.use(json())

app.use(
  cors({
    origin: "https://hospital-appointment-booking-system.netlify.app",
    credentials: true,
  })
);

app.use('/',router)
app.use('/admin',admin)

mongoose.connect(process.env.MONGO_URL).then(()=>{
  console.log('mongoDB connected ');
})
.catch((err)=>{
    console.log('mongoDB not connected',err);
    
})

app.listen(process.env.PORT, () => {
  console.log("Server running on port 8000");
});