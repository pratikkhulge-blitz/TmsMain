import cors, { CorsOptions } from "cors";
import config from "../constants/constants";

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || config.allowedOrigins.includes(origin)) {
      // console.log(`Origin ${origin} has requested and is allowed.`);
      callback(null, true);
    } else {
      console.log(`Origin ${origin} has requested and is not allowed.`);
      callback(new Error("Unauthorized"));
    }
  },
};


const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
