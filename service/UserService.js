import bcrypt from "bcrypt";

import TokenService from "./TokenService.js";
import EmailService from "./EmailService.js";

import User from "../models/User.js";

import UserDto from "../dto/userDto.js";
class UserService{
    async createUser(newUser, res){
        try{
            const {login, password, name, picture} = newUser
            const hashedPassword = password ? await bcrypt.hash(password, await bcrypt.genSalt()) : ""
            const regType = password ? 'password' : 'google'
            const emailIsVerified = regType === 'google'
            const user = await User.create({login, password: hashedPassword, name, picture, inboxID:Date.now(), regType, emailIsVerified})
            const {accessToken, refreshToken} = await this.#createSession(user)

            if (regType === 'password') await EmailService.sendVerification(login)

            res.cookie('refreshToken', refreshToken, { maxAge: 1209600000, httpOnly: true });
            const userDto = new UserDto(user, accessToken)
            console.log(user)
            console.log(userDto)
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
                res.status(200).json(new UserDto({...user, accessToken}))
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
}

const userService = new UserService()
export default userService