import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routing/user.js'
import tagRouter from "./routing/tag.js";
import todoRouter from "./routing/todo.js";
import favoriteRouter from "./routing/favorite.js";
import WebSocketManager from './WebSocket.js';
import * as dotenv from 'dotenv'
import projectRouter from "./routing/project.js";
import http from "http";

/*-------------------------- SETTINGS -------------------------*/

const app = express()
const server = http.createServer(app);
const PORT = process.env.PORT || 3000

dotenv.config()
if (process.env.NODE_ENV !== "test"){
    mongoose.set('strictQuery', true)
    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => console.log("Successfully connected to DB")
        ).catch(() => console.log("Failed connection to DB"))
}

app.use(cookieParser('key'))
app.use(express.json())
app.use(cors({
    origin: '*',
    credentials: true,
}));

/*-------------------------- ROUTING --------------------------*/

app.use('/user', userRouter)
app.use('/todo', todoRouter)
app.use('/tag', tagRouter)
app.use('/project', projectRouter)
app.use('/favorite', favoriteRouter)

/*-------------------------- RUNNING SERVER --------------------------*/

new WebSocketManager(server);

server.listen(PORT, (err) => {
    if (err) console.log("Server doesn't work")
    else console.log(`Server started at port ${PORT}`)
})

export default server
