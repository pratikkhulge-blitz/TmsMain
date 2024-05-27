import mongoose, { Document, Schema } from "mongoose";

interface User {
  userId: Schema.Types.ObjectId;
  name: string;
  email: string;
  active: boolean;
}

interface DepartmentDocument extends Document {
  organisation_name: string;
  name: string;
  users: User[];
}

const userSchema = new Schema<User>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
});

const departmentSchema = new Schema<DepartmentDocument>({
  organisation_name: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
});

const Department = mongoose.model<DepartmentDocument>("Department", departmentSchema);

export default Department;

