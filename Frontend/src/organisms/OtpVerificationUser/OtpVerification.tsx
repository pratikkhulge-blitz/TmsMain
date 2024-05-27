// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { verifyOtp, resendOtp } from '@/services';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export default function OtpVerification() {
//     const router = useRouter();
//     const [otp, setOtp] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const { email } = router.query;
//         if (!email) {
//             toast.error('Email not found.');
//             return;
//         }
//         const res = await verifyOtp(email, otp);
//         if (res.success) {
//             toast.success(res.message);
//             setTimeout(() => {
//                 navigate('/');
//             }, 2000);
//         } else {
//             toast.error(res.message);
//         }
//     };

//     const handleResendOTP = async () => {
//         const { email } = router.query;
//         if (!email) {
//             toast.error("Email not found.");
//             return;
//         }
//         try {
//             const res = await resendOtp(email);
//             if (res.success) {
//                 toast.success(res.message);
//             } else {
//                 toast.error(res.message);
//             }
//         } catch (error) {
//             console.error("Error while resending OTP:", error);
//             toast.error("Failed to resend OTP. Please try again later.");
//         }
//     };

//     return (
//         <>
//             <section className="bg-indigo-700 text-center text-indigo-600">
//                 <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//                     <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-indigo-800 dark:border-indigo-700">
//                         <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//                             <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-600 md:text-2xl dark:text-white">
//                                 OTP Verification
//                             </h1>
//                             <form onSubmit={handleSubmit}>
//                                 <div className='text-left'>
//                                     <label htmlFor="otp" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Enter OTP</label>
//                                     <input
//                                         type="text"
//                                         value={otp}
//                                         onChange={(e) => setOtp(e.target.value)}
//                                         id="otp"
//                                         className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                         placeholder="123456"
//                                         required
//                                     />
//                                 </div>
//                                 <br></br>
//                                 <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Verify OTP</button>
//                             </form>
//                             <div className="mt-4">
//                                 <p className="text-sm font-light text-indigo-500 dark:text-indigo-400">
//                                     Didn't receive OTP? <button onClick={handleResendOTP} className="font-medium text-indigo-600 hover:underline dark:text-primary-500">Resend OTP</button>
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <ToastContainer />
            
//         </>
//     );
// }


// import { useState, FormEvent } from 'react';
// import { verifyOtp, resendOtp } from '../../services/index';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useParams, useNavigate } from 'react-router-dom';


// export default function OtpVerification() {
//     const navigate = useNavigate();
//     const [otp, setOtp] = useState<string>('');

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         const { email } = useParams<{ email: string }>();
//         if (!email || typeof email !== 'string') {
//             toast.error('Email not found.');
//             return;
//         }
//         const res = await verifyOtp(email, otp);
//         if (res.success) {
//             toast.success(res.message);
//             setTimeout(() => {
//                 navigate('/');
//             }, 2000);
//         } else {
//             toast.error(res.message);
//         }
//     };

//     const handleResendOTP = async () => {
//         const { email } = useParams<{ email: string }>();
//         if (!email || typeof email !== 'string') {
//             toast.error("Email not found.");
//             return;
//         }
//         try {
//             const res = await resendOtp(email);
//             if (res.success) {
//                 toast.success(res.message);
//             } else {
//                 toast.error(res.message);
//             }
//         } catch (error) {
//             console.error("Error while resending OTP:", error);
//             toast.error("Failed to resend OTP. Please try again later.");
//         }
//     };

//     return (
//         <>
//             <section className="bg-indigo-700 text-center text-indigo-600">
//                 <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//                     <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-indigo-800 dark:border-indigo-700">
//                         <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//                             <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-600 md:text-2xl dark:text-white">
//                                 OTP Verification
//                             </h1>
//                             <form onSubmit={handleSubmit}>
//                                 <div className='text-left'>
//                                     <label htmlFor="otp" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Enter OTP</label>
//                                     <input
//                                         type="text"
//                                         value={otp}
//                                         onChange={(e) => setOtp(e.target.value)}
//                                         id="otp"
//                                         className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                         placeholder="123456"
//                                         required
//                                     />
//                                 </div>
//                                 <br></br>
//                                 <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Verify OTP</button>
//                             </form>
//                             <div className="mt-4">
//                                 <p className="text-sm font-light text-indigo-500 dark:text-indigo-400">
//                                     Didn't receive OTP? <button onClick={handleResendOTP} className="font-medium text-indigo-600 hover:underline dark:text-primary-500">Resend OTP</button>
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <ToastContainer />
//         </>
//     );
// }

import { useState, FormEvent } from 'react';
import { verifyOtp, resendOtp } from '../../services/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import './OtpVerification.scss'

export default function OtpVerification() {
    const { email } = useParams<{ email: string }>(); // Move useParams outside the component
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || typeof email !== 'string') {
            toast.error('Email not found.');
            return;
        }
        const res = await verifyOtp(email, otp);
        if (res.success) {
            toast.success(res.message);
            setTimeout(() => {
                navigate('/userlogin');
            }, 2000);
        } else {
            toast.error(res.message);
        }
    };

    const handleResendOTP = async () => {
        if (!email || typeof email !== 'string') {
            toast.error("Email not found.");
            return;
        }
        try {
            const res = await resendOtp(email);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error("Error while resending OTP:", error);
            toast.error("Failed to resend OTP. Please try again later.");
        }
    };

    return (
        <>
            <section className="bg-indigo-700 text-center text-indigo-600">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-indigo-800 dark:border-indigo-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-600 md:text-2xl dark:text-white">
                                OTP Verification
                            </h1>
                            <form onSubmit={handleSubmit}>
                                <div className='text-left'>
                                    <label htmlFor="otp" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        id="otp"
                                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="123456"
                                        required
                                    />
                                </div>
                                <br></br>
                                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Verify OTP</button>
                            </form>
                            <div className="mt-4">
                                <p className="text-sm font-light text-indigo-500 dark:text-indigo-400">
                                    Didn't receive OTP? <button onClick={handleResendOTP} className="font-medium text-indigo-600 hover:underline dark:text-primary-500">Resend OTP</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </>
    );
}

