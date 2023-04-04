import mongoose, {Schema} from "mongoose"

const tokenSchema = new mongoose.Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    refreshToken:{
        type: String,
        required: true
    }
})

export default mongoose.model('token', tokenSchema)