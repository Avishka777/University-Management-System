import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(
    () => {console.log('Mongo DB is Connected');
}).catch((err) => {
    console.log(err);
});

const app = express();