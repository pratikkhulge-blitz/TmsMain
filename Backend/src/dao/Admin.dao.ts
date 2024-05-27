import Admin from "../models/admin.models";

export default class AdminDAO {
    public static async findAdminByEmail(email: string): Promise<any> {
        const admin = await Admin.findOne({ email });
        return admin;
    }

    public static async createAdmin(email: string, password: any, otpGenerated: string): Promise<any> {
        const newAdmin = await Admin.create({
            email,
            password,
            otp: {
                code: otpGenerated,
                createdAt: new Date(),
            },
        });
        return newAdmin;
    }

    
}
