import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    color:{
        type: Object,
        required:true
    },
    todos: {
        type:[Object],
        default: []
    },
});

export default mongoose.model('project', projectSchema)