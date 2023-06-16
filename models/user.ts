import { Schema, Model, model } from 'mongoose';
import { IUser, IUserDocument, IUserModel } from '../interfaces/IUser';

const UserSchema: Schema<IUserDocument> = new Schema({
    dateCreated: {
        type: Date,
        default: function(){
            return Date.now();
        }
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const User = model<IUserDocument, IUserModel>("users", UserSchema);

export default User;
