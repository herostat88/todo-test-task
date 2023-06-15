import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    dateRegistered: {
        type: Date,
        default: function(){
            return Date.now();
        }
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

export default mongoose.model("user", userSchema);
