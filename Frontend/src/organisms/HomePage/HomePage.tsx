import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Homepage.scss'
import { Cookies } from 'react-cookie';


const HomePage: React.FC = () => {
const cookies = new Cookies();
const navigate =  useNavigate()
  useEffect(() => {
    const admintoken = cookies.get('admintoken');
    if (admintoken) {
      navigate('/adminhome');
    } 
    const token = cookies.get('token');
    if (token) {
      navigate('/userhome');
    } 
  }, []);
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-900 to-indigo-700">
      <nav className="bg-gray-800 p-4">
        <div className="flex items-center justify-center">
          <Link to="/" className="text-white text-3xl font-bold">
            Ticket Management System
          </Link>
        </div>
      </nav>
      <div className="flex flex-row flex-grow">
        <div className="flex flex-grow justify-center items-center">
          <div className="m-4 bg-white rounded-lg shadow-lg p-6 text-center w-96">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Welcome, User!</h2>
            <p className="text-gray-800 mb-6">
              Welcome to our Ticket Management System! Whether you're a regular user or a new visitor, our platform offers an intuitive experience for managing your tickets efficiently. Explore our platform to access a range of user features tailored to your needs. Sign in or sign up now to get started.
            </p>
            <Link
              to="/userlogin"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg mb-2 transition duration-300 ease-in-out inline-block w-full"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="flex flex-grow justify-center items-center">
          <div className="m-4 bg-white rounded-lg shadow-lg p-6 text-center w-96">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Admin Access</h2>
            <p className="text-gray-800 mb-6">
              Attention admins! Take control of your ticketing system with our Admin Access feature. Manage users, tickets, and system settings with ease. Our platform provides powerful tools to streamline your workflow and ensure efficient ticket management. Sign in or register now to unleash the full potential of our Ticket Management System.
            </p>
            <Link
              to="/admin"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg mb-2 transition duration-300 ease-in-out inline-block w-full"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <footer className="text-white text-center pb-4">
        <p>&copy; {new Date().getFullYear()} Ticket Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;