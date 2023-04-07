import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
    user_id:{
        type: String
    },
    label:{
        type: String,
        required: true
    },
    id:{
        type: Number,
        required: true,
        unique:true
    },
    description:{
        type:String,
        required:false
    },
    priority:{
        type:String,
        required:false
    },
    date:{
        type:String,
        required:false
    },
})

export default mongoose.model('todo', todoSchema)