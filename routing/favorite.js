import { Router } from "express";

import FavoriteController from "../controllers/favoriteController.js";

const favoriteRouter = Router()

favoriteRouter.get('/get', FavoriteController.getFavorites)
favoriteRouter.post('/add', FavoriteController.addFavorite)
favoriteRouter.delete('/delete', FavoriteController.deleteFavorite)
export default favoriteRouter