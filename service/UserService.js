import User from "../models/User.js";
import tokenService from "./TokenService.js";
import UserDto from "../dto/userDto.js";
import bcrypt from "bcrypt";
import EmailService from "./emailService.js";
class UserService{
    async create({login, password, name, picture}){
        try{
            const hashedPassword = password ? await bcrypt.hash(password, await bcrypt.genSalt()) : ""
            const regType = password ? 'password' : 'google'
            const emailIsVerified =  regType === 'google'
            const user = await User.create({login, password: hashedPassword, name, picture, inboxID:Date.now(), regType, emailIsVerified})
            const {accessToken, refreshToken} = await tokenService.generate(user)
            user.accessToken = accessToken
            user.refreshToken = refreshToken
            await user.save()
            const userDto = new UserDto(user)
            if (regType === 'password') await EmailService.sendVerification(login)
            return {userDto, refreshToken}
        }catch (e)
        {
            return {userDto: null, refreshToken: null}
        }

    }
}

const userService = new UserService()
export default userService