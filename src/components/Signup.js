import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import FormControl from '@mui/material/FormControl';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import bg_icon from '../../src/imgs/bg5.png';
import logo from '../../src/imgs/logo.png';
import { useDispatch } from 'react-redux';
import { login, register } from '../utils/slices/authslice';
import { validateEmail, validatePhone, validatePassword } from '../utils/Validate';
import { api_rout_url } from '../utils/Constants';

const Signup = () => {
    const [isshowPassword, setisshowpassword] = useState(false);
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [phone, setphone] = useState("");
    const [password, setpassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const [msg, setmsg] = useState("")

    const handleClickShowPassword = () => {
        setisshowpassword(!isshowPassword);
    };

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleRegister = async () => {
        try {
            // Clear previous error messages
            setEmailError("");
            setPhoneError("");
            setPasswordError("");

            // Perform form field validations
            const isEmailValid = validateEmail(email);
            const isPasswordValid = validatePassword(password);
            const isPhoneValid = validatePhone(phone);

            if (!isEmailValid) {
                setEmailError("Invalid email address");
                toast.error("Invalid email address");
            }
            if (!isPasswordValid) {
                setPasswordError("Invalid password");
                toast.error("Invalid password");
            }
            if (!isPhoneValid) {
                setPhoneError("Invalid phone number");
                toast.error("Invalid phone number");
            }

            // Proceed with registration if validations pass
            if (isEmailValid && isPasswordValid && isPhoneValid) {
                const response = await fetch(`${api_rout_url}/api/v1/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, password })
                });

                if (response.ok) {
                    const user = { name, email, phone };
                    setRegistrationSuccess(true);
                    dispatch(register(user));
                    setIsLogin(true);
                    toast.success("Registration successful");
                    // Redirect to login page or display success message
                } else {
                    const data = await response.json();
                    if (data.message) {
                        // Set error message in state to display in UI
                        setEmailError(data.message);
                        toast.error(data.message);
                    }
                    console.error("Registration failed");
                    // Handle registration failure (e.g., display error message)
                }
            }
        } catch (error) {
            console.error("Error during registration:", error.message);
            toast.error("Error during registration");
            // Handle registration error (e.g., display error message)
        }
    };

    // In your authentication logic after successful login
    // Modify your login function to store the user ID in session storage
    const handleLogin = async (userData) => {
        try {
            const response = await fetch(`${api_rout_url}/api/v1/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                const id = data.user._id;

                // Store the user ID in session storage
                sessionStorage.setItem('userId', id);

                const userRole = data.user.role;

                // Redirect logic based on user role
                if (userRole === "admin") {
                    navigate("/dashboard/admin");
                } else if (userRole === "user") {
                    navigate("/dashboard/user");
                } else {
                    // Role neither admin nor user
                    // Show message or handle redirection as per your requirement
                    console.log("Please contact admin to update your role");
                }
            } else {
                // Handle login error
                console.error("Login failed:", response.statusText);
                toast.error("Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Error during login");
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-center bg-cover bg-black ' style={{ backgroundImage: `url(${bg_icon})` }}>
            <ToastContainer />
            <p className='absolute mb-[410px] text-stone-500 text-lg mr-6'>{isLogin ? "Login" : "Register"}</p>
            <div className="p-8 rounded-md shadow-2xl mb-2 ">
                {!isLogin && (
                    <>
                        <div className="mb-4 mt-10">
                            <TextField id="outlined-required" label="Name" variant="outlined" fullWidth onChange={(e) => setname(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <TextField required id="outlined-required" label="Phone Number" variant="outlined" fullWidth onChange={(e) => setphone(e.target.value)} />
                            {phoneError && <p className="text-red-500 text-xs">{phoneError}</p>}
                        </div>
                    </>
                )}
                <div className="mb-4">
                    <TextField required id="outlined-required" label="E-mail" variant="outlined" size='large' fullWidth onChange={(e) => setemail(e.target.value)} />
                    {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                </div>
                <div className="mb-4">
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={isshowPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {isshowPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </FormControl>
                    {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                </div>
                <p className='text-[11px] cursor-pointer hover:text-gray-800 text-gray-500' onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "New to Nexus ?" : "Already have an account ?"}
                </p>
                <div className='mb-4 mt-3'>
                    <Button variant="contained" size="large" fullWidth endIcon={<SendIcon />} onClick={isLogin ? handleLogin : handleRegister}>
                        {isLogin ? "Login" : "Register"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
