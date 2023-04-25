import jwt from "jsonwebtoken"
class TokenService{
    async generate(user){
        const {_id, login} = user
        const accessToken = jwt.sign({_id, login}, process.env.accessSecretKey, {expiresIn: '5m'})
        const refreshToken = jwt.sign({_id, login}, process.env.refreshSecretKey, {expiresIn: '14d'})
        return {accessToken, refreshToken}
    }
}

const tokenService = new TokenService()
export default tokenService