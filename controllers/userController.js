import UserService from "../service/UserService.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
class UserController{
    async signUp(req, res){
        try {
            const user = req.body
            await UserService.createUser(user, res)
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
            const fileName = req.body.nickname + '_' + 'avatar';
            await UserService.setAvatar(avatar, fileName, res)
        } catch (err) {
            console.error(err);
            res.status(500).end()
        }
        return res
    }

    async getUsers(req, res) {
        try {
            const {projectId, login} = req.query
            const regex = new RegExp(login, 'i');
            const DTO = []
            const project = await Project.findById(projectId)
            const users = await User.find({login:regex})
            for(const user of users) {
                if (!project.members.some(member => member.id === user.id)){
                    const {login, picture, regType, name} = user
                    DTO.push({login, picture, regType, name})
                }
            }
            res.status(200).json(DTO.slice(0, 10))
        }catch (e) {
            console.error(e)
            res.status(500).end
        }
        return res
    }
}
const userController = new UserController()
export default userController
