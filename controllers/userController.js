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
                    await user.save()
                    return res.status(200).json(new UserDto(user))
                }
            }
            return res.status(404).end()
        } catch (e) {
            console.error(e)
            return res.status(500).end()
        }
    }

    async signIn(req, res){
        try {
            const {userDto, refreshToken} = await userService.create(req.body)
            res.cookie('refreshToken', refreshToken, { maxAge: 1209600000, httpOnly: true });
            return res.status(200).json(userDto)
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }
    }
}
const userController = new UserController()
export default userController
