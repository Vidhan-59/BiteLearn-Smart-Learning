// import React, { useState } from 'react';
// import { Label } from '../components/ui/Label';
// import { Input } from '../components/ui/Input';
// import { Button } from '../components/ui/Button';
// import { Link, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';

// export default function Login() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   const validateForm = () => {
//     const { username, password } = formData;

//     if (!username.trim() || !password.trim()) {
//       setError('All fields are required');
//       return false;
//     }

//     setError(''); // Clear error message if validation passes
//     return true;
//   };

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setSuccessMessage('');
//     try {
//       const response = await fetch('http://localhost:8000/api/login/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();
//       console.log([...response.headers.entries()]);

//       if (!response.ok) {
//         console.error('Login error:', data);
//         setError(data.error || 'An error occurred during login');
//       } else {
//         // Fetch the token from the response headers
//         const authorizationHeader = response.headers.get('Authorization');
//         if (authorizationHeader) {
//           const token = authorizationHeader.split(' ')[1]; // Extract token after 'Token'
//           console.log(token)
//           if (token) {
//             // Save the token using js-cookie
//             Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'Lax' });

//             setSuccessMessage('Login successful!');
//             console.log('Token:', token); // Store the token in your state or context for later use
//             navigate('/dashboard'); // Redirect to a dashboard or homepage after successful login
//           } else {
//             setError('Token not found in response headers.');
//           }
//         } else {
//           setError('Authorization header not found in the response.');
//         }
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       setError('An error occurred. Please try again later.');
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
//             to="/signup"
//             className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
//           >
//             Sign Up
//           </Link>
//         </div>
//         <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
//       </div>
//       <div className="flex items-center justify-center">
//         <div className="w-full max-w-md space-y-6 p-6">
//           <div className="space-y-2 text-center">
//             <h2 className="text-3xl font-bold">Sign In</h2>
//             <p className="text-muted-foreground">Enter your credentials to access your account.</p>
//           </div>
//           {error && <p className="text-red-500 text-center">{error}</p>}
//           {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
//           <form className="space-y-4" onSubmit={handleLogin}>
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input id="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
//             </div>
//             <Button type="submit" className="w-full bg-black">
//               Sign In
//             </Button>
//           </form>
//           <div className="text-center text-sm text-muted-foreground">
//             Don't have an account?{' '}
//             <Link to="/signup" className="underline">
//               Sign Up
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
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const { username, password } = formData;
    if (!username.trim() || !password.trim()) {
      setError('All fields are required');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.status === 401 && data.message.includes('not verified')) {
        setError(data.message);
        setEmail(data.email);
        setShowOtp(true);
      } else if (response.ok) {
        const authorizationHeader = response.headers.get('Authorization');
        if (authorizationHeader) {
          const token = authorizationHeader.split(' ')[1];
          if (token) {
            
            Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'Lax', path: '/' });
            Cookies.set('username' , data.name ,  { expires: 7, secure: true, sameSite: 'Lax', path: '/' })
            setSuccessMessage('Login successful!');
            navigate('/');
          }
        }
      } else {
        setError(data.error || 'An error occurred during login');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          otp: formData.otp,
          email: email,
        }),
      });

      const data = await response.json();
      console.log()
      if (response.ok) {
        setSuccessMessage('OTP verified successfully. Logging in...');
        setShowOtp(false);
        handleLogin(event); // Retry login after OTP verification
      } else {
        setError(data.error || 'OTP verification failed');
      }
    } catch (err) {
      setError('An error occurred while verifying OTP. Please try again later.');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 h-screen w-full">
      <div className="relative flex items-center justify-center bg-primary text-primary-foreground">
        <div className="z-10 p-10 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Welcome Back!</h1>
            <p className="text-lg text-primary-foreground/80">
              Enter your credentials to access your account.
            </p>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
          >
            Sign Up
          </Link>
        </div>
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30" />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Login</h2>
            <p className="text-muted-foreground">Access your BiteLearn account.</p>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
          <form className="space-y-4" onSubmit={showOtp ? handleVerifyOtp : handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} className="w-full" />
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
                <Button type="submit" className="w-full bg-black">
                  Verify OTP
                </Button>
              </>
            )}
            {!showOtp && (
              <Button type="submit" className="w-full bg-black">
                Sign In
              </Button>
            )}
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




