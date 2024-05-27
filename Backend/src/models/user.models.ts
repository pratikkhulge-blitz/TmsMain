import mongoose, { Document, Schema } from "mongoose";

interface Ticket {
  ticketId: Schema.Types.ObjectId;
  status: "TOBEPICKED" | "INPROGRESS" | "INTESTING" | "COMPLETED";
  assignee: string | null;
}

interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  created: Date;
  lastActive: Date | null;
  active: boolean;
  role: "USER" | "ADMIN";
  department?: Schema.Types.ObjectId;
  organisationNames?: string[];
}

const userSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
  organisationNames: {
    type: [String],
    default: [],
    required: function(this: UserDocument) {
      return this.role === 'USER';
    }
  }
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
