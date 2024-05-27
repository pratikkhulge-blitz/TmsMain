
import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  name?: string;
  email: string;
  created?: string;
  password: string;
  lastActive?: string;
  active?: boolean;
}

const userSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    default: new Date().toISOString(),
  },
  password: {
    type: String,
    required: true,
  },
  lastActive: {
    type: String,
    required: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const UserModel = mongoose.model<User>("Admin", userSchema);

export default UserModel;

