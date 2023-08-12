import TagService from "../service/TagService.js";

class TagController{
    async addTag(req, res){
        try {
            const userId = req.query.user_id
            const tag = req.body
            await TagService.addTag(userId, tag, res)
        } catch (err) {
            console.error(err);
            res.status(500).end()
        }
        return res
    }
    async updateTag(req, res){
        try {
            const userId = req.query.user_id
            const tag = req.body
            await TagService.updateTag(userId, tag, res)
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }
    }
    async deleteTag(req, res) {
        try {
            const userId = req.query.user_id
            const tagId = req.query.tag_id
            await TagService.deleteTag(userId, tagId, res)
        } catch (err) {
            console.error(err);
            res.status(500).end();
        }
        return res
    }
    async getTags(req, res){
        try {
            const userId = req.query.user_id
            await TagService.getTags(userId)
        } catch (err) {
            console.error(err);
            res.status(500).end()
        }
        return res
    }
}
const tagController = new TagController()
export default tagController
