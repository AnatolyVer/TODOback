import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    _id: {
        type: Number,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    priority: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: false
    },
    done:{
        type: Boolean,
        required: true
    }
}, { _id: false });

export default mongoose.model('todo', todoSchema)