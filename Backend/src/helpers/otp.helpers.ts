import otpGenerator from "otp-generator";
import config from "../constants/constants";

export const generateOTP = (): string => {
  const OTP: string = otpGenerator.generate(config.OTP_LENGTH, config.OTP_CONFIG);
  return OTP;
};
