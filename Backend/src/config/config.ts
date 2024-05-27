import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "./cors";
import config from "../constants/constants";
import router from "../routes/router";

class App {
  public app: Express;
  public port: string | number;
  public db: typeof mongoose;
  private SERVER_DB_URI: string;

  constructor() {
    this.app = express();
    this.port = config.SERVER_PORT;
    this.db = mongoose;
    this.SERVER_DB_URI = config.SERVER_DB_URI;

    this.initializeMiddlewares();
    this.initializeRoutes(); 
  }

  private initializeMiddlewares(): void {
    this.app.use(cors);
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.use("/", router);
  }

  public async listen(): Promise<void> {
    try {
      await this.db.connect(this.SERVER_DB_URI);
      this.app.listen(this.port, () => {
        console.log("------------------------------------------------------------------------");
        console.log(`Running On Port : ${this.port}`);
        console.log("Connected : ", this.SERVER_DB_URI);
        console.log("------------------------------------------------------------------------");
      });
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }
}

export default App;
