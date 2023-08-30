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
    members: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        default: []
    },
    color:{
        type: Object,
        required:true
    },
    isPinned:{
        type: Boolean,
        default: false
    },
    todos: {
        type:[Object],
        default: []
    },
});

export default mongoose.model('project', projectSchema)