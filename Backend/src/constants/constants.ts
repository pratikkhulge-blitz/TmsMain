import dotenv from "dotenv";

dotenv.config();

interface OTPConfig {
  upperCaseAlphabets: boolean;
  lowerCaseAlphabets: boolean;
  specialChars: boolean;
}

interface MailSettings {
  host: string;
  service:string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

class AppConfig {
  public allowedOrigins: string[];
  public SERVER_PORT: string | number;
  public SERVER_DB_URI: string;
  public JWT_SECRET: string;
  public OTP_LENGTH: number;
  public OTP_CONFIG: OTPConfig;
  public MAIL_SETTINGS: MailSettings;

  constructor() {
    this.allowedOrigins = ["http://localhost:5000", "http://localhost:3000" ,"http://localhost:5175" ,"http://localhost:5173"];
    this.SERVER_PORT = process.env.PORT || 5000;
    this.SERVER_DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/test";
    this.JWT_SECRET = "thisIsASimpleTest";
    this.OTP_LENGTH = 6;
    this.OTP_CONFIG = {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    };
    this.MAIL_SETTINGS = {
      service: "Gmail",
  host: "smtp.gmail.com",
      port: 587,
      auth: {
          user: 'Pratikkhulge@gmail.com',
          pass: 'kadu ypfc aupv tijz'
      },
    };
  }
}

const config = new AppConfig();

export default config;
