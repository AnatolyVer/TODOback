import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    members: {
        type: [Object],
        required:true
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
    shared: {
        type: String,
        default: 'private'
    }
});

export default mongoose.model('project', projectSchema)