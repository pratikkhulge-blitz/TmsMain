import { Router } from "express";
import authController from "../controllers/admin.controller";
import deptController from "../controllers/department.controller";
import loginController from "../controllers/auth.controller";
import TicketController from "../controllers/ticket.controller";

const router = Router();
const ticketController = new TicketController();


router.post("/", authController.signUp);
router.post("/verify", authController.verifyEmail);
router.post("/resendotp", authController.generateOTP);
router.post('/login', loginController.adminLogin);

router.post('/department', deptController.addDepartment); 
router.get('/department', deptController.showAllDepartments);
router.get('/organisationstats', deptController.fetchOrganisationStats);
router.get('/usersindepartment', deptController.showAllUsersInDepartments);
router.put('/department/:organizationName', deptController.updateDepartment); 
router.delete('/department/:organizationName', deptController.deleteDepartment); 
router.get('/tickets/all', ticketController.showAllTickets); 
router.post('/adminloginwithotp' ,loginController.AdminLoginWithOtp )

export default router;
