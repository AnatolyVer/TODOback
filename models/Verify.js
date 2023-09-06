import mongoose from "mongoose"

const verifySchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    emailToken: {
        type: String,
        unique: true,
        required:true
    },
});

export default mongoose.model('verify', verifySchema)