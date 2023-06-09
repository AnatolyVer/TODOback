import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    todos: {
        type:[Object],
        default: []
    },
    name:{
        type: String,
        default: ''
    },
    picture:{
        type: String,
        default: ''
    },
    tags: {
        type:[Object],
        default: []
    },
    favorites: {
        type:[Object],
        default: []
    },
    accessToken: {
        type: String,
        default: "",
        unique: true
    },
    refreshToken: {
        type: String,
        default: "",
        unique: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    inboxID: {
        type: String,
        default:Date.now(),
        unique:true
    },
    projects: {
        type: [Object],
        default:[]
    },
});

export default mongoose.model('user', userSchema)