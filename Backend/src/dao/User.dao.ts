import UserModel from "../models/user.models";
import { generateOTP } from "../helpers/otp.helpers";
import encryptionManager from "../helpers/crypto.helpers";
import DepartmentModel from "../models/department.models";
import { sendMail } from "../helpers/mail.helpers";



export class UserDao {
    public static async createUser(firstName: string,
        lastName: string,
        email: string,
        hashedPassword:  string | false ,
        dateOfBirth: Date,
        organisation_name: string,
        ): Promise<any> {
        return await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            dateOfBirth,
            organisationNames: [organisation_name],
        });
        

    }

    public static async findUserByEmail(email: string): Promise<any> {
        const user = await UserModel.findOne({ email });
        return user;
    }
}
