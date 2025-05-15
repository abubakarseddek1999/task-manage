"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import login from "../../assets/signup.png"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import { useState } from "react"
import { jwtDecode } from "jwt-decode"

const Login = () => {
    const [registerError, setRegisterError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    // const HandleLogin = (e) => {
    //     e.preventDefault();
    //     const form = e.target;
    //     const email = form.email.value;
    //     const password = form.password.value;
    
    //     // Reset error
    //     setRegisterError("");
    
    //     const data = { email, password };
    
    //     fetch("https://task-management-server-beta-nine.vercel.app/login", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(data),
    //     })
    //         .then((response) => {
    //             if (!response.ok) {
    //                 // Handle HTTP error status (like 401)
    //                 throw new Error("Invalid email or password");
    //             }
    //             return response.json();
    //         })
    //         .then((data) => {
    //             console.log(data)
    //             if (data.name && data.token) {
    //                 localStorage.setItem("token", data.token); // Store token
    //                 localStorage.setItem("user", JSON.stringify(data.name)); // Optional: Store user info
    //                 alert("Login successful");
    //                 navigate('/'); // Redirect to homepage
    //             } else {
    //                 setRegisterError("Invalid response from server");
    //             }
    //         })
            
    //         .catch((error) => {
    //             console.error(error);
    //             setRegisterError(error.message || "Something went wrong");
    //         });
    // };
    

    const HandleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
    
        // Reset error
        setRegisterError("");
    
        const data = { email, password };
    
        fetch("https://task-management-server-beta-nine.vercel.app/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    // Handle HTTP error status (like 401)
                    throw new Error("Invalid email or password");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.token && data.user) {
                    localStorage.setItem("token", data.token); // Store token
                    localStorage.setItem("user", JSON.stringify(data.user));
    
                    alert("Login successful");
                    window.location.href = "/";
                    // navigate('/'); 
    
                    // Optional: Auto-logout after token expiry
                    const decoded = jwtDecode(data.token);
                    const expiryTime = decoded.exp * 1000 - Date.now(); // in milliseconds
                    console.log(expiryTime)
                    if (expiryTime > 0) {
                        setTimeout(() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            navigate('/login');
                        }, expiryTime);
                    }
                    
                } else {
                    setRegisterError("Invalid response from server");
                }
            })
            .catch((error) => {
                console.error(error);
                setRegisterError(error.message || "Something went wrong");
            });
    };
    
    return (
        <div className="container mx-auto px-4 min-h-[calc(100vh-70px)] flex items-center justify-center overflow-x-hidden">
            <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-6xl gap-4">
                <div className="hidden md:flex w-full md:w-1/2 justify-center p-4 ">
                    <img className="max-w-full h-auto object-contain" src={login || "/placeholder.svg"} alt="login" />
                </div>

                <div className="w-full md:w-1/2 max-w-md p-4">
                    <div className="card rounded-2xl shadow-2xl py-5 bg-base-100">
                        <form onSubmit={HandleLogin} className="w-full py-2 p-5 z-10 bg-white rounded-xl">
                            <h2 className="text-2xl font-bold text-center uppercase my-5"> Login</h2>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    name="email"
                                    className="w-full mt-3 mb-8 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:black focus:border-white transition duration-150 ease-in-out focus:shadow-[3px_3px_10px_rgba(0,0,0,1),-1px_-1px_6px_rgba(255,255,255,0.4),inset_3px_3px_10px_rgba(0,0,0,1),inset_-1px_-1px_6px_rgba(255,255,255,0.4)]"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Confirm Password</span>
                                </label>
                                <div className="relative mt-3">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Your password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:black focus:border-white transition duration-150 ease-in-out focus:shadow-[3px_3px_10px_rgba(0,0,0,1),-1px_-1px_6px_rgba(255,255,255,0.4),inset_3px_3px_10px_rgba(0,0,0,1),inset_-1px_-1px_6px_rgba(255,255,255,0.4)]"
                                        required
                                    />
                                    <span
                                        className="absolute top-3 right-2 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                    </span>
                                </div>
                                {registerError && <p className="text-red-500 font-bold mt-1">{registerError}</p>}
                            </div>

                           
                            <div className="form-control mt-8">
                                <input
                                    className="w-full p-2 cursor-pointer rounded-md bg-[#3734ff] hover:bg-[#161551] transition text-xl font-bold mb-2 text-white shadow-xl"
                                    type="submit"
                                    value="Sign Up"
                                />
                            </div>
                            <div className="flex mt-2 mb-5 justify-center">
                                <Link to="/signup" className="text-blue-600 hover:underline">
                                    You have no account? <span className="text-red-500 hover:underline font-bold">SignUp</span>
                                </Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
