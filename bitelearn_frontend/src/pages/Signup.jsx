// import React, { useState } from 'react';
// import { Label } from '../components/ui/Label';
// import { Input } from '../components/ui/Input';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button } from '../components/ui/Button';

// export default function Signup() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     contact_number: '',
//     password: '',
//     otp: '',
//   });
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showOtp, setShowOtp] = useState(false);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   const validateForm = () => {
//     const { username, email, contact_number, password } = formData;

//     if (!username.trim() || !email.trim() || !contact_number.trim() || !password.trim()) {
//       setError('All fields are required');
//       return false;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return false;
//     }
//     if (!/\d/.test(password)) {
//       setError('Password must contain at least one number');
//       return false;
//     }
//     if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
//       setError('Password must contain at least one special character');
//       return false;
//     }

//     setError('');
//     return true;
//   };

//   const handleRegister = async (event) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setSuccessMessage('');
//     setError('');
//     try {
//       const response = await fetch('http://localhost:8000/api/signup/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           email: formData.email,
//           contact_number: formData.contact_number,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         if (data.non_field_errors) {
//           setError(data.non_field_errors.join(', ') || 'An error occurred during registration');
//         } else {
//           setError(data.message || 'An error occurred during registration');
//         }
//       } else {
//         setSuccessMessage('Registration successful! OTP sent to your email.');
//         setShowOtp(true);
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again later.');
//     }
//   };

//   const handleVerifyOtp = async (event) => {
//     event.preventDefault();
//     setError('');
//     setSuccessMessage('');

//     try {
//       const response = await fetch('http://localhost:8000/api/verify-otp/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           username: formData.username,
//           email: formData.email,
//           contact_number: formData.contact_number,
//           password: formData.password,
//           otp: formData.otp,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.errors || 'OTP verification failed');
//       } else {
//         setSuccessMessage('OTP verified successfully. Registration complete.');
//         navigate('/login');
//       }
//     } catch (err) {
//       setError('An error occurred while verifying OTP. Please try again later.');
//     }
//   };

//   return (
//     <div className="grid lg:grid-cols-2 h-screen w-full">
//       <div className="relative flex items-center justify-center bg-primary text-primary-foreground">
//         <div className="z-10 p-10 space-y-6 text-center">
//           <div className="space-y-2">
//             <h1 className="text-4xl font-bold">Welcome to BiteLearn</h1>
//             <p className="text-lg text-primary-foreground/80">
//               Unlock your potential with our engaging e-learning platform.
//             </p>
//           </div>
//           <Link
//             to="/login"
//             className="inline-flex items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
//           >
//             Sign In
//           </Link>
//         </div>
//         <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
//       </div>
//       <div className="flex items-center justify-center">
//         <div className="w-full max-w-md space-y-6 p-6">
//           <div className="space-y-2 text-center">
//             <h2 className="text-3xl font-bold">Sign Up</h2>
//             <p className="text-muted-foreground">Create your BiteLearn account.</p>
//           </div>
//           {error && <p className="text-red-500 text-center">{error}</p>}
//           {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
//           <form className="space-y-4" onSubmit={showOtp ? handleVerifyOtp : handleRegister}>
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input id="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} className="w-full" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="contact_number">Contact Number</Label>
//               <Input id="contact_number" placeholder="Enter your contact number" value={formData.contact_number} onChange={handleChange} className="w-full" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="w-full" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className="w-full" />
//             </div>
//             {showOtp && (
//               <div className="space-y-2">
//                 <Label htmlFor="otp">OTP</Label>
//                 <Input id="otp" placeholder="Enter the OTP sent to your email" value={formData.otp} onChange={handleChange} className="w-full" />
//               </div>
//             )}
//             <Button type="submit" className="w-full bg-black !important">
//   {showOtp ? 'Verify OTP' : 'Sign Up'}
// </Button>

//           </form>
//           <div className="text-center text-sm text-muted-foreground">
//             Already have an account?{' '}
//             <Link to="/login" className="underline">
//               Sign In
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState } from 'react';
import { Label } from '../components/ui/Label';
import { Input } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contact_number: '',
    password: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const { username, email, contact_number, password } = formData;

    if (!username.trim() || !email.trim() || !contact_number.trim() || !password.trim()) {
      setError('All fields are required');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!/\d/.test(password)) {
      setError('Password must contain at least one number');
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError('Password must contain at least one special character');
      return false;
    }

    setError('');
    return true;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSuccessMessage('');
    setError('');
    setShowOtp(true); // Show OTP section immediately after form validation

    try {
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          contact_number: formData.contact_number,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.non_field_errors) {
          setError(data.non_field_errors.join(', ') || 'An error occurred during registration');
        } else {
          setError(data.message || 'An error occurred during registration');
        }
        setShowOtp(false); // Hide OTP section if registration fails
      } else {
        setSuccessMessage('Registration successful! OTP sent to your email.');
  
        // Check if user_id is available in the response data
        if (data.user_id) {
          localStorage.setItem('user_id', data.user_id);
        } else {
          console.warn('User ID is not present in the response data.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setShowOtp(false); // Hide OTP section if there's an error
    }
  };

  const resendOtp = async () => {
    const userId = localStorage.getItem('user_id');
    
    console.log('Retrieved user_id from local storage:', userId); // Add this for debugging
  
    if (!userId) {
      setError('User ID is not found in local storage.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/resend/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          user_id: userId, // Include user_id in the request body
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.errors || 'Failed to resend OTP');
      } else {
        setSuccessMessage('OTP resent successfully. Please check your email.');
      }
    } catch (err) {
      setError('An error occurred while resending OTP. Please try again later.');
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          contact_number: formData.contact_number,
          password: formData.password,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.errors || 'OTP verification failed');
        resendOtp();
      } else {
        setSuccessMessage('OTP verified successfully. Registration complete.');
        navigate('/login');
      }
    } catch (err) {
      setError('An error occurred while verifying OTP. Please try again later.');
    }
  };

  const handleVerifyLater = () => {
    navigate('/login');
  };

  return (
    <div className="grid lg:grid-cols-2 h-screen w-full">
      <div className="relative flex items-center justify-center bg-primary text-primary-foreground">
        <div className="z-10 p-10 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Welcome to BiteLearn</h1>
            <p className="text-lg text-primary-foreground/80">
              Unlock your potential with our engaging e-learning platform.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
          >
            Sign In
          </Link>
        </div>
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Sign Up</h2>
            <p className="text-muted-foreground">Create your BiteLearn account.</p>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
          <form className="space-y-4" onSubmit={showOtp ? handleVerifyOtp : handleRegister}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_number">Contact Number</Label>
              <Input id="contact_number" placeholder="Enter your contact number" value={formData.contact_number} onChange={handleChange} className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className="w-full" />
            </div>
            {showOtp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input id="otp" placeholder="Enter the OTP sent to your email" value={formData.otp} onChange={handleChange} className="w-full" />
                </div>
                <button type="button" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800" onClick={resendOtp}>
                  Resend OTP
                </button>
                <button type="button" className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700" onClick={handleVerifyLater}>
                  Verify Later
                </button>
              </>
            )}
            <Button type="submit" className="w-full bg-black">
              {showOtp ? 'Verify OTP' : 'Sign Up'}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
