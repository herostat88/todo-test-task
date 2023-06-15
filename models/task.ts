import { Schema, Model, model } from 'mongoose';
import { ITask, ITaskDocument, ITaskModel } from '../interfaces/ITask';

const TaskSchema: Schema<ITaskDocument> = new Schema({
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

TaskSchema.statics.createTask = (args: ITask) => {
    return new Task(args);
}

TaskSchema.statics.findById = async function(
  this: Model<ITaskDocument>,
  id: string
) {
    return this.findById(id).exec();
}

const Task = model<ITaskDocument, ITaskModel>("tasks", TaskSchema);

export default Task;
