import { model, Schema } from 'mongoose';
import { IUser } from '../types/index';

const schema = new Schema <IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

export const UserSchema = model('Users', schema);
