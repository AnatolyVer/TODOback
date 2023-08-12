import { Router } from "express";

import FavoriteController from "../controllers/favoriteController.js";

const favoriteRouter = Router()

favoriteRouter.get('/get_favorites', FavoriteController.getFavorites)
favoriteRouter.post('/add_favorite', FavoriteController.addFavorite)
favoriteRouter.delete('/delete_favorite', FavoriteController.deleteFavorite)
export default favoriteRouter