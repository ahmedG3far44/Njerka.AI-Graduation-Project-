import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import rootRouter from './routes/root.route';

// import {connectDB} from './config/db';

dotenv.config();


const app = express();
const port = process.env.PORT || 8080;


app.use(cors({
    origin: [
        "http://localhost:5173", "http://localhost:3000"
    ],
    methods: [
        "GET", "POST", "PUT", "DELETE"
    ],
    allowedHeaders: [
        "Content-Type", "Authorization"
    ],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


async function startServer() {
    try { // await connectDB();

        app.get('/', (req : Request, res : Response) => {
            res.send('Ngirka AI Server is OK');
        });
        app.use('/api', rootRouter);
        app.listen(port, () => console.log(`Ngirka AI Server is running on ${port}`));
    } catch (error) {
        console.log("Error starting server ");
    }
}


startServer()
