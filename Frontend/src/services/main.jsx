
export const register_user = async (formData) => {
    try {
        const res = await fetch('http://localhost:5000/user', { // Changed the endpoint to match the backend
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(formData),
        });
        const data = res.json();
        return data;
    } catch (error) {
        console.log('Error in register_user (service) => ', error);
        return error.message
    }
};

export const register_admin = async (formData) => {
    try {
        const res = await fetch('http://localhost:5000/admin', { 
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(formData),
        });
        const data = res.json();
        return data;
    } catch (error) {
        console.log('Error in register_admin (service) => ', error);
        return error.message
    }
};

export const resendOtp = async (email) => {
    try {
        const res = await fetch('http://localhost:5000/user/resendotp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error in resendOtp service:', error);
        return { success: false, message: await res.text() };
    }
};

export const resendOtpAdmin = async (email) => {
    try {
        const res = await fetch('http://localhost:5000/admin/resendotp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error in resendOtp service:', error);
        return { success: false, message: await res.text() };
    }
};



export const verifyOtp = async (email, otp) => {
    try {
        const res = await fetch(`http://localhost:5000/user/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        console.log(data);
        return data;
        
    } catch (error) {
        console.log('Error in verifyOtp (service) => ', error);
        return { success: false, message: error.message };
    }
};



export const verifyOtpAdmin = async (email, otp) => {
    try {
        const res = await fetch(`http://localhost:5000/admin/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        // console.log(data);
        return data;
        
    } catch (error) {
        console.log('Error in verifyOtp (service) => ', error);
        return { success: false, message: error.message };
    }
};


export const login_user = async (formData) => {
    try {
        const res = await fetch('http://localhost:5000/user/login', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
            const token = data.token;
            localStorage.setItem('token', token);
            return { success: true, message: data.message, token };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error in login_user service:', error);
        return { success: false, message: 'Failed to login. Please try again later.' };
    }
};

export const login_admin = async (formData) => {
    try {
        const res = await fetch('http://localhost:5000/admin/login', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
            const token = data.token;
            localStorage.setItem('token', token);
            return { success: true, message: data.message, token };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error in login_user service:', error);
        return { success: false, message: 'Failed to login. Please try again later.' };
    }
};


export const loginUserOTP = async (email) => {
    try {
        const res = await fetch('http://localhost:5000/user/loginUserOTP', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(email),
        });
        const data = await res.json();
        if (res.ok) {
            return { success: true, message: data.message, token };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error in login_user service:', error);
        return { success: false, message: 'Failed to login. Please try again later.' };
    }
};

export async function userLoginWithOtp(data) {
    try {
      // Make an API call to log in with OTP
      const response = await fetch('http://localhost:5000/user/userLoginWithOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error logging in with OTP:', error);
      return { success: false, message: 'Failed to log in with OTP' };
    }
  }
