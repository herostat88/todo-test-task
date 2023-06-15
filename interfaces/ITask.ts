import { Document, Model } from 'mongoose';

export interface ITask {
    dateCreated: Date;
    isCompleted: boolean;
    title: string;
    content: string;
}

export interface ITaskDocument extends ITask, Document {}
export interface ITaskModel extends Model<ITaskDocument> {
    createTask(args: ITask): ITaskDocument;
}
