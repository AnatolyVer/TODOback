import jwt from "jsonwebtoken"
class TokenService{
    async generate(user){
        const {_id, login} = user
        try {
            const accessToken = jwt.sign({_id, login}, process.env.ACCESS_SECRET_KEY, {expiresIn: '5m'})
            const refreshToken = jwt.sign({_id, login}, process.env.REFRESH_SECRET_KEY, {expiresIn: '14d'})
            return {accessToken, refreshToken}
        }catch (e){
            console.error(e)
            return {accessToken:null, refreshToken:null}
        }

    }
}

const tokenService = new TokenService()
export default tokenService