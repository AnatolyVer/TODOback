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

    async addFavorite(req, res){
        try {
            const user_id = req.query.user_id
            const type = req.body.type
            const itemId = req.body.itemId
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            user.favorites.push({type, itemId})
            await user.save()
            return res.status(200).end()
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
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

           /* let index
            do {
                index = user.todos.findIndex(obj => obj.tags.id === id);
                console.log(user.todos[index])
            } while (index > -1);*/

            await user.save();
            return res.status(200).end();
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }
    }


    async deleteFavorite(req, res) {
        try {
            const user_id = req.query.user_id
            const itemId = req.query.itemId
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }

            const favoriteIndex = user.favorites.findIndex(obj => obj.itemId === itemId)
            if (favoriteIndex === -1) {
                return res.status(404).end()
            }
            user.favorites.splice(favoriteIndex, 1)
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

    async getFavorites(req, res){
        try {
            const user_id = req.query.user_id
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            return res.status(200).json(user.favorites)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async getInboxID(req, res){
        try {
            const user_id = req.query.user_id
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            console.log(user.inboxID)
            if (!(user.inboxID.length)){
                console.log('update')
                user.inboxID = Date.now().toString()
                await user.save()
            }
            console.log(user.inboxID)
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


}
const userController = new UserController()
export default userController
