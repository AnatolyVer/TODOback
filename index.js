import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'
import cookieParser from 'cookie-parser'

import router from './routing/index.js'

import * as dotenv from 'dotenv'

/*-------------------------- SETTINGS -------------------------*/

mongoose.set('strictQuery', true)
dotenv.config()
mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log("Successfully connected to DB")
).catch(() => console.log("Failed connection to DB"))

const app = express()


app.use(cookieParser('key'))
app.use(express.json())
app.use(cors({
    origin: '*',
    credentials: true,
}));
app.use('/uploads', express.static('uploads'))
app.use('/api', router)


const storage = multer.diskStorage({
    destination:(_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, `${file.originalname}.jpg`)
    }
})

const upload = multer({storage})

app.post('/upload', upload.single('image'), (req, res) => {
    res.status(200)
})

/*-------------------------- RUNNING SERVER --------------------------*/

app.listen(process.env.PORT, (err) => {
    if (err) console.log("Server doesn't work")
    else console.log(`Server started at port ${process.env.PORT}`)
})