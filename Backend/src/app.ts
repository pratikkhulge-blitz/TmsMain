import App from "./config/config";
import constant from "./constants/constants";

const initializeApp = async () => {
  try {
    const app = new App(); 
    await app.db.connect(constant.SERVER_DB_URI); 
    app.listen();
  } catch (error) {
    console.log(error);
  }
};

initializeApp(); 


