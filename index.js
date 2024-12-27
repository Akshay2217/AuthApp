import express from 'express';
import mongoose from  'mongoose';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import bodyParser from 'body-parser';
import router from './Routes/userRoute.js';
import bookRouter from './Routes/bookRoute.js';

configDotenv();

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use(express.json());
// mongodb connection
const mongoString = process.env.MONGO_URL

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})



app.get('/', (req, res) => {
    res.send('<h1>Server started successfully</h1>')
})


app.use('/user/v1',router)
app.use('/user/v1', bookRouter)

app.get('/user', (req, res) => {
    res.send('<h1>Server started successfully</h1>')
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT} PORT`)
})