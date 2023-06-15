import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    dateCreated: {
        type: Date,
        default: function(){
            return Date.now();
        }
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
});

export default mongoose.model("task", taskSchema);
