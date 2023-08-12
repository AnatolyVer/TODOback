import path, {dirname} from 'path'
import {fileURLToPath} from 'url';
import {Storage} from '@google-cloud/storage'



import userService from "../service/UserService.js";

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
}
const userController = new UserController()
export default userController
