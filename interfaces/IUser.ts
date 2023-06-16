import { Document, Model } from 'mongoose';

export interface IUser {
    dateCreated: Date;
    email: string;
    password: string;
}

export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {}
