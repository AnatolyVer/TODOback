import User from "../models/User.js";
class TagService{
    async addTag(userId, tag, res){
        try {
            const user = await User.findById(userId)
            user.tags.push(tag)
            await user.save()
            res.status(200).end()
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
    async updateTag(userId, newTag, res){
        try {
            const user = await User.findById(userId)
            const index = user.tags.findIndex(obj => obj.id === newTag.id);
            if (index === -1) throw new Error('Tag doesnt found')
            const oldTag = user.tags[index];
            for (let key in newTag) {
                if (newTag[key] !== null && key !== "id") {
                    oldTag[key] = newTag[key];
                }
            }
            user.tags[index] = oldTag;
            await user.save();
            res.status(200).end();
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }

    async deleteTag(userId, tagId, res){
        try {
            const user = await User.findById(userId)

            const tagIndex = user.tags.findIndex(obj => obj.id === id)
            if (tagIndex === -1) throw new Error('Tag doesnt found')
            user.tags.splice(tagIndex, 1)

            let index
            do {
                index = user.todos.findIndex(obj => obj.tags.id === tagId);
                if (index > -1) {
                    user.todos.splice(index, 1);
                }
            } while (index > -1);

            await user.save();
            res.status(200).end();
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }

    async getTags(userId, res){
        try {
            const user = await User.findById(userId)
            res.status(200).json(user.tags)
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
}
const tagService = new TagService()
export default tagService

