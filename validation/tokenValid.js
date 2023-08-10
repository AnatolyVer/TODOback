import jwt from "jsonwebtoken";
import User from "../models/User.js";
import tokenService from "../service/TokenService.js";
const checkValidToken = async (req, res, next) => {
    try {
        const accessToken = req.headers['authorization'].split(' ')[1]
        const refreshToken = req.cookies.refreshToken
        const _id = req.query.user_id

        const user = await User.findById(_id)
        if (accessToken != null && refreshToken != null) {
            let currentSession = user.session.indexOf(item => item.accessToken === accessToken && item.refreshToken === refreshToken)
            if (currentSession)
            {
                try {
                    await jwt.verify(accessToken, process.env.accessSecretKey)
                    next();
                }catch (e){
                    console.log('Access token has expired')
                    try {
                        await jwt.verify(refreshToken, process.env.refreshSecretKey)
                        {
                            const {accessToken, refreshToken} = await tokenService.generate(user)
                            user.session[currentSession] = {
                                accessToken,
                                refreshToken
                            }
                            await user.save()
                            res.cookie('refreshToken', refreshToken, { maxAge: 1209600000, httpOnly: false });
                            return res.status(403).json({accessToken})
                        }
                    }catch (e){
                        console.log('Access and refresh token has expired')
                        //add logic of unlogin
                    }
                }
            }
        }
    }
    catch (e){
        console.log(e)
    }
    return res.status(401).end()
}

export default checkValidToken