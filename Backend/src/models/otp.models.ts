import mongoose, { Document, Schema } from "mongoose";

interface OTPDocument extends Document {
  email: string;
  code: number | null;
  expired: boolean;
  verified: boolean;
  createdAt : any
}

const otpSchema = new Schema<OTPDocument>({
  email: {
    type: String,
    required: true
  },
  code: {
    type: Number,
    required: true
  },
  expired: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
});

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });
otpSchema.pre<OTPDocument>('save', function(next) {
  if (this.isNew) {
    const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000);
    if (this.createdAt < fifteenMinutesAgo) {
      this.expired = true;
    }
  }
  next();
});

const OTP = mongoose.model<OTPDocument>("OTP", otpSchema);

export default OTP;