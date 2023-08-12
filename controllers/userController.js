import jwt from "jsonwebtoken";
import path, {dirname} from 'path'
import {fileURLToPath} from 'url';
import {Storage} from '@google-cloud/storage'

import User from "../models/User.js";
import Verify from "../models/Verify.js";

import userService from "../service/UserService.js";
import EmailService from "../service/EmailService.js";

import UserService from "../service/UserService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const credentialsPath = path.join(__dirname, process.env.PATH_TO_PROD_JSON);
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const storage = new Storage({ projectId: process.env.PROD_PROJECT_ID })
const bucketName = process.env.GOOGLE_BUCKET_NAME
const bucket = storage.bucket(bucketName)

class UserController{
    async signUp(req, res){
        try {
            const user = req.body
            await userService.createUser(user, res)
        } catch (e) {
            console.error(e);
            res.status(500).end();
        }
        return res
    }
    async auth(req, res){
        try {
            const user = req.body
            const regType = req.query.regType
            await UserService.authUser(user, regType, res)
        } catch (e) {
            console.error(e)
            res.status(500).end()
        }
        return res
    }
    async addProject(req, res){
        try {
            const user_id = req.query.user_id
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            user.projects.push({...req.body})
            await user.save()
            return res.status(200).end()
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async updateProject(req, res){
        try {
            const user_id = req.query.user_id
            const id = req.query.id
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            const index = user.projects.findIndex(obj => obj.id === id);
            if (index === -1) {
                return res.status(404).end();
            }
            const oldProject = user.projects[index];
            const newProject = req.body
            for (let key in newProject) {
                if (newProject[key] !== null && key !== "id") {
                    oldProject[key] = newProject[key];
                }
            }
            user.projects[index] = oldProject;
            await user.save();
            return res.status(200).end();
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }
    }

    async deleteProject(req, res) {
        try {
            const user_id = req.query.user_id
            const id = req.query.id
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            const tagIndex = user.projects.findIndex(obj => obj.id === id)
            if (tagIndex === -1) {
                return res.status(404).end()
            }
            user.projects.splice(tagIndex, 1)
            user.todos = user.todos.filter(obj => obj.projectId !== id)
            await user.save();
            return res.status(200).json(user.todos);
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }
    }

    async getInboxID(req, res){
        try {
            const user_id = req.query.user_id
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            if (!(user.inboxID.length)){
                user.inboxID = Date.now().toString()
                await user.save()
            }
            return res.status(200).json(user.inboxID)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async getProjects(req, res){
        try {
            const user_id = req.query.user_id
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            return res.status(200).json(user.projects)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async getProject(req, res){
        try {
            const user_id = req.query.user_id
            const id = req.query.id
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            let todos = []
            user.todos.map(obj => {
                if (obj.projectId === id) todos.push(obj)
            });

            return res.status(200).json(todos)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async setAvatar(req, res){
        try {
            const avatar = req.file;
            if (!avatar) {
                return res.status(400).send('Файл не был загружен.');
            }
            const fileName = req.body.nickname + '_' + 'avatar'; // Генерируем уникальное имя файла
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

            stream.on('finish', () => {
                console.log('Файл успешно загружен на Google Cloud Storage.');
                return res.status(200).end()
            });
            stream.end(avatar.buffer);
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async getAvatar(req, res){
        try {
            const nickname = req.query.nickname;
            const file = bucket.file(nickname + '_avatar');


            file.getSignedUrl({
                action: 'read',
                expires: '03-09-2033',
            }, (err, url) => {
                if (err) {
                    console.error('Ошибка при получении ссылки на файл:', err);
                    res.status(500).send('Произошла ошибка при получении файла.');
                } else {
                    return res.status(200).send(url)
                }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async confirmEmail(req, res){
        try {
            const emailToken = req.body.emailToken;
            const record = await Verify.findOne({emailToken})
            if (!record) return res.status(404).end()
            jwt.verify(emailToken, process.env.EMAIL_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(404).end()
                } else {
                    await Verify.deleteOne({emailToken});
                    const user = await User.findOne({login: record.email, regType:'password'})
                    user.emailIsVerified = true
                    await user.save()
                    return res.status(200).end()
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async resendEmail(req, res){
        try {
            const login = req.body.login;
            await EmailService.sendVerification(login)
            return res.status(200).end()
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }


    async sendEmailVerifiedStatus(req, res){
        try {
            const login = req.query.login;
            const user = await User.findOne({login})
            return res.status(200).json(user.emailIsVerified)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async checkTokenValid(req, res){
        try {
            return res.status(200).send("All is valid")
        } catch (err) {
            console.log(err)
            return res.status(500).end()
        }
    }



}
const userController = new UserController()
export default userController
