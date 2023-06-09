import User from "../models/User.js";
import userService from "../service/UserService.js";
import bcrypt from "bcrypt";
import UserDto from "../dto/userDto.js";
import tokenService from "../service/TokenService.js";
class UserController{
    async auth(req, res){
        try {
            const {login, password} = req.body
            const user = await User.findOne({login})
            if(user){
                if (await bcrypt.compare(password, user.password)){
                    const {accessToken, refreshToken} = await tokenService.generate(user)
                    user.accessToken = accessToken
                    user.refreshToken = refreshToken
                    res.cookie('refreshToken', refreshToken, { maxAge: 1209600000, httpOnly: true });
                    await user.save()
                    return res.status(200).json(new UserDto(user))
                }
            }
            return res.status(404).send("Wrong login or password")
        } catch (e) {
            console.error(e)
            return res.status(500).end()
        }
    }

    async signUp(req, res){
        try {
            const {userDto, refreshToken} = await userService.create(req.body)
            if (userDto){
                res.cookie('refreshToken', refreshToken, { maxAge: 1209600000, httpOnly: true });
                return res.status(200).json(userDto)
            }
            return res.status(400).send("User already exists")
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }
    }

    async addTag(req, res){
        try {
            const user_id = req.query.user_id
            const name = req.query.tag
            const id = req.query.id
            const settings = req.body
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            user.tags.push({name, id, settings})
            user.save()
            return res.status(200).end()
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async updateTag(req, res){
        try {
            const user_id = req.query.user_id
            const name = req.query.tag
            const id = req.query.id
            const settings = req.body
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            const index = user.tags.findIndex(obj => obj.id === id);
            if (index === -1) {
                return res.status(404).end();
            }
            const oldTag = user.tags[index];
            const newTag = {name, settings};
            for (let key in newTag) {
                if (newTag[key] !== null && key !== "id") {
                    oldTag[key] = newTag[key];
                }
            }
            user.tags[index] = oldTag;
            await user.save();
            return res.status(200).end();
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }
    }

    async deleteTag(req, res) {
        try {
            const user_id = req.query.user_id
            const id = req.query.id
            console.log(user_id, id)
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            const tagIndex = user.tags.findIndex(obj => obj.id === id)
            if (tagIndex === -1) {
                return res.status(404).end()
            }
            user.tags.splice(tagIndex, 1)
            let index
            do {
                index = user.todos.findIndex(obj => obj.tags.id === id);
                if (index > -1) {
                    user.todos.splice(index, 1);
                }
            } while (index > -1);
            await user.save();
            return res.status(200).end();
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }
    }

    async getTags(req, res){
        try {
            const user_id = req.query.user_id
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            return res.status(200).json(user.tags)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }
}
const userController = new UserController()
export default userController
