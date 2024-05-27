import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/AdminLogin";
import Adminhome from "./pages/AdminHome";
import Adminregister from "./pages/AdminRegister";
import OtpAdmin from "./pages/OtpVerificationAdmin"
import UserLogin from "./pages/UserLogin"
import UserRegister from "./pages/UserRegister"
import UserHome from "./pages/UserHome"
import OtpUser from "./pages/OtpVerificationUser"
import Otpindex from "./organisms/OtpIndex"
import HomePage from './pages/HomePage'
import DepartmentDetails from './organisms/DepartmentDetailsModal'
import Otpindexadmin from './pages/OtpIndexAdmin'
import 'rsuite/dist/rsuite.min.css'
export default function routes() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="adminhome">
            <Route index element={<Adminhome />} />
            <Route path="userregister" element={<UserRegister />} />
          </Route>
          <Route path="/adminhome" element={<Adminhome />} />
          <Route path="/adminregister" element={<Adminregister />} />
          <Route path="/otp-verification/:email" element={<OtpAdmin />} />
          <Route path="/userlogin" element={<UserLogin />} />
          {/* <Route path="/userregister" element={<UserRegister />} /> */}
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/otp-verification-user/:email" element={<OtpUser />} />
          <Route path="/otpindex" element={<Otpindex />} />
          <Route path="/department/:id" element={<DepartmentDetails/>} />
          <Route path="/otpindexadmin" element={<Otpindexadmin/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

