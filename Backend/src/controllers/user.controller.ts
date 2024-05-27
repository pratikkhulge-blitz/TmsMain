import { Request, Response } from "express";
import  UserService  from "../services/user.service";

class UserController {
    public static async signUpUser(req: Request, res: Response): Promise<void> {
        await UserService.signUpUser(req, res);
    }

    public static async verifyUserEmail(req: Request, res: Response): Promise<void> {
        await UserService.verifyUserEmail(req, res);
    }

    public static async generateNewUserOTP(req: Request, res: Response): Promise<void> {
        await UserService.generateNewUserOTP(req, res);
    }

    public static async loginUserOTP(req: Request, res: Response): Promise<void> {
        await UserService.loginUserOTP(req, res);
    }
}

export default UserController;


// import { Request, Response } from "express";
// import UserService from "../services/user.service";

// class UserController {

//     private userservice = new UserService();

//     // Function to sign up a user
//     signUpUser = async (req: Request, res: Response): Promise<void> => {
//         await this.userservice.signUpUser(req, res);
//     }

//     // Function to verify user's email
//     verifyUserEmail = async (req: Request, res: Response): Promise<void> => {
//         await this.userservice.verifyUserEmail(req, res);
//     }

//     // Function to generate new OTP for user
//     generateNewUserOTP = async (req: Request, res: Response): Promise<void> => {
//         await this.userservice.generateNewUserOTP(req, res);
//     }

//     // Function to login user with OTP
//     loginUserOTP = async (req: Request, res: Response): Promise<void> => {
//         await this.userservice.loginUserOTP(req, res);
//     }
// }

// export default UserController;
