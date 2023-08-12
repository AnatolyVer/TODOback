import FavoriteService from "../service/FavoriteService.js";

class FavoriteController{
    async addFavorite(req, res){
        try {
            const userId = req.query.user_id
            const favorite = req.body
            await FavoriteService.addFavorite(userId, favorite, res)
        } catch (err) {
            console.error(err);
            res.status(500).end()
        }
        return res
    }

    async deleteFavorite(req, res) {
        try {
            const userId = req.query.user_id
            const favoriteId = req.query.favorite_id
            await FavoriteService.deleteFavorite(userId, favoriteId, res)
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }
    }
    async getFavorites(req, res){
        try {
            const userId = req.query.user_id
            await FavoriteService.getFavorites(userId, res)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

}
const favoriteController = new FavoriteController()
export default favoriteController
