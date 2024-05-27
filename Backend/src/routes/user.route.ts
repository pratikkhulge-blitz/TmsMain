import { Router } from "express";
import authController from "../controllers/user.controller";
import loginController from "../controllers/auth.controller";
import TicketController from "../controllers/ticket.controller";
import Getuserdetails from "../controllers/userdetails.controller"
import deptController from "../controllers/department.controller";
import generateOTPAndSendEmail from "../controllers/userdetails.controller"

const router = Router();
const ticketController = new TicketController();
const Getuserdetail = new Getuserdetails();


router.post("/", authController.signUpUser);
router.post("/verify", authController.verifyUserEmail);
router.post("/resendotp", authController.generateNewUserOTP);
router.post('/login', loginController.userLogin);
router.get('/tickets', ticketController.showTicketsInOrganization);
router.get('/reportedtickets', ticketController.showReportedTicketsInOrganizations);
router.get('/showticketcountdetails', ticketController.showticketcountdetails);
router.post('/tickets/create', ticketController.createTicket);
router.put('/tickets/update/:key', ticketController.updateTicket);
router.post('/loginUserOTP',authController.loginUserOTP);
router.post('/userLoginWithOtp',loginController.userLoginWithOtp);
router.put('/commitchange',Getuserdetail.verifyOTPAndCommitChanges);
router.get('/getuserdetails',Getuserdetail.getuserdetails);
router.get('/showallorganisationsnames',deptController.showallorganisationsnames)

export default router;
