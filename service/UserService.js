import bcrypt from "bcrypt";
import path, {dirname} from 'path'
import {fileURLToPath} from 'url';
import {Storage} from '@google-cloud/storage'

import TokenService from "./TokenService.js";
import EmailService from "./EmailService.js";

import User from "../models/User.js";

import UserDto from "../dto/userDto.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const credentialsPath = path.join(__dirname, process.env.PATH_TO_PROD_JSON);
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const storage = new Storage({ projectId: process.env.PROD_PROJECT_ID })
const bucketName = process.env.GOOGLE_BUCKET_NAME
const bucket = storage.bucket(bucketName)
class UserService{
    async createUser(newUser, res){
        try{
            const {login, password, name, picture} = newUser
            const hashedPassword = password ? await bcrypt.hash(password, await bcrypt.genSalt()) : ""
            const regType = password ? 'password' : 'google'
            const emailIsVerified = regType === 'google'
            const isCreated = await User.findOne({login, regType})
            if (isCreated) throw new Error('User already exist')
            const user = await User.create({login, password: hashedPassword, name, picture, inboxID:Date.now(), regType, emailIsVerified})
            const {accessToken, refreshToken} = await this.#createSession(user)
            res.cookie('refreshToken', refreshToken, { maxAge: 1209600000, httpOnly: true });

            if (regType === 'password') await EmailService.sendVerification(login, res)

            const userDto = new UserDto(user, accessToken)
            res.status(200).json(userDto)
        }catch (e) {
            console.error(e)
            res.status(400).send("User already exists")
        }
    }
    async authUser(userToAuth, regType, res){
        try{
            const {login, password = ''} = userToAuth
            const user = await User.findOne({login, regType})
            if (await bcrypt.compare(password, user.password) || regType === 'google'){
                const {accessToken, refreshToken} = await this.#createSession(user)
                res.cookie('refreshToken', refreshToken, { maxAge: 1209600000, httpOnly: true });
                const userDto = new UserDto(user, accessToken)
                res.status(200).json(userDto)
            }
            else {
                res.status(404).send('Something went wrong')
            }
        }catch (e){
            console.error(e)
            res.status(404).send("Wrong data or user don't exist")
        }
    }
    async #createSession(user){
        try{
            const {accessToken, refreshToken} = await TokenService.generate(user)
            user.session.push({
                accessToken,
                refreshToken,
                logged_at: new Date()
            })
            await user.save()
            return {accessToken, refreshToken}
        }catch (e) {
            throw new Error(e)
        }
    }

    async setAvatar(avatar, fileName, res){
        try{
            const gcsFile = bucket.file(fileName);

            const stream = gcsFile.createWriteStream({
                metadata: {
                    contentType: avatar.mimetype,
                },
            });

            stream.on('error', (err) => {
                console.error('Ошибка при загрузке файла:', err);
                next(err);
            });

            stream.on('finish', async () => {
                console.log('Файл успешно загружен на Google Cloud Storage.');
            });
            stream.end(avatar.buffer);
            await this.#getAvatar(gcsFile, res)
        }catch (e) {
            console.error(e)
            res.status(400).end()
        }
    }

    async #getAvatar(fileName, res){
        try {
            const currentDate = new Date();
            const expiresDate = new Date(currentDate);
            expiresDate.setFullYear(currentDate.getFullYear() + 1);

            await fileName.getSignedUrl({
                action: 'read',
                expires: expiresDate.toISOString(),
            }, (err, url) => {
                if (err) throw new Error('Error of getting url')
                res.status(200).send(url + `&data=${Date.now()}`)
            });
        } catch (e) {
            throw new Error(e)
        }
    }
}

const userService = new UserService()
export default userService