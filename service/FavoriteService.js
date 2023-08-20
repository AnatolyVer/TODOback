import User from "../models/User.js";
class FavoriteService{
    async addFavorite(userId, favorite, res){
        try {
            const user = await User.findById(userId)
            user.favorites.push(favorite)
            await user.save()
            res.status(200).end()
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
    async deleteFavorite(userId, favoriteId, res){
        try {
            const user = await User.findById(userId)
            const favoriteIndex = user.favorites.findIndex(obj => obj.itemId === favoriteId)
            if (favoriteIndex === -1) throw new Error('Tag doesnt found')
            user.favorites.splice(favoriteIndex, 1)
            await user.save();
            res.status(200).end();
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
    async getFavorites(userId, res){
        try {
            const user = await User.findById(userId)
            res.status(200).json(user.favorites)
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
}
const favoriteService = new FavoriteService()
export default favoriteService

