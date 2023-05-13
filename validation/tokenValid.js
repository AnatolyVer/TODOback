import jwt from "jsonwebtoken";
import User from "../models/User.js";
import tokenService from "../service/TokenService.js";
const checkValidToken = async (req, res, next) => {
    try {
        const accessToken = req.headers['authorization'].split(' ')[1]
        const refreshToken = req.cookies.refreshToken
        const _id = req.query.user_id
        if (accessToken != null) {
            const isAccessValid = await jwt.verify(accessToken, process.env.accessSecretKey)
            if (isAccessValid){
                const user = await User.findById(_id)
                if (accessToken === user.accessToken) next();
                else return res.status(401).end()
            }
            else {
                console.log("checking refresh")
                const isRefreshValid = await jwt.verify(refreshToken, process.env.refreshSecretKey)
                if (isRefreshValid){
                    const decodedRefreshToken = jwt.decode(refreshToken)
                    const user = await User.findById(decodedRefreshToken._id)
                    const {accessToken, refreshToken} = await tokenService.generate(user)
                    user.accessToken = accessToken
                    user.refreshToken = refreshToken
                    await user.save()
                    res.cookie('refreshToken', refreshToken, { maxAge: 1209600000, httpOnly: true });
                    return res.status().json({accessToken})
                }
                else {
                    console.log("fail")
                    return res.status(401).end()
                }
            }
        }
    }catch (e){
        console.log(e)
        return res.status(401).end()
    }


}

export default checkValidToken