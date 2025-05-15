"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import login from "../../assets/signup.png"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import { useState } from "react"

const SignUp = () => {
    const [registerError, setRegisterError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const HandleCreatUser = (e) => {
        e.preventDefault()
        const form = e.target
        const email = form.email.value
        const password = form.password.value
        const name = form.name.value
        const country = form.country.value
        const accepted = form.terms.checked
        console.log(email, password, name, country)

        // reset error
        setRegisterError("")

        if (password.length < 6) {
            setRegisterError("password should be at 6 characters or long")
            return
        } else if (!/[A-Z]/.test(password)) {
            setRegisterError("your password should have at least one upper case character ")
            return
        } else if (!/[!@#$%^&*()_+{}[\]:;<>,.?~-]/.test(password)) {
            setRegisterError("your password should have at least one special character ")
            return
        } else if (!accepted) {
            setRegisterError("please accept our terms and condition !")
            return
        }
        // pass data to backend
        const data = {
            name: name,
            email: email,
            password: password,
            country: country,
        }
        console.log(data)
        // post by using fetch
        fetch("https://task-management-server-beta-nine.vercel.app/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data.acknowledged === true))
            .then((data) => {
                if (data.acknowledged === true) {
                    // redirect to home page
                    alert("user created successfully")
                    // navigate to login page
                    navigate('/login')
                }
                else {
                    // show error message
                    setRegisterError("something went wrong")
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }

    return (
        <div className="container mx-auto px-4 min-h-[calc(100vh-70px)] flex items-center justify-center overflow-x-hidden">
            <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-6xl gap-4">
                <div className="w-full md:w-1/2 flex justify-center p-4">
                    <img className="max-w-full h-auto object-contain" src={login || "/placeholder.svg"} alt="login" />
                </div>

                <div className="w-full md:w-1/2 max-w-md p-4">
                    <div className="card rounded-2xl shadow-2xl bg-base-100">
                        <form onSubmit={HandleCreatUser} className="w-full py-2 p-5 z-10 bg-white rounded-xl">
                            <h2 className="text-2xl font-bold text-center uppercase my-5">Welcome</h2>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text mb-2 font-bold">Name</span>
                                </label>
                                <input
                                    type="name"
                                    placeholder="Your name"
                                    name="name"
                                    className="w-full my-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:black focus:border-white transition duration-150 ease-in-out focus:shadow-[3px_3px_10px_rgba(0,0,0,1),-1px_-1px_6px_rgba(255,255,255,0.4),inset_3px_3px_10px_rgba(0,0,0,1),inset_-1px_-1px_6px_rgba(255,255,255,0.4)]"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Country</span>
                                </label>
                                <input
                                    type="country"
                                    placeholder="Your country"
                                    name="country"
                                    className="w-full my-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:black focus:border-white transition duration-150 ease-in-out focus:shadow-[3px_3px_10px_rgba(0,0,0,1),-1px_-1px_6px_rgba(255,255,255,0.4),inset_3px_3px_10px_rgba(0,0,0,1),inset_-1px_-1px_6px_rgba(255,255,255,0.4)]"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    name="email"
                                    className="w-full my-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:black focus:border-white transition duration-150 ease-in-out focus:shadow-[3px_3px_10px_rgba(0,0,0,1),-1px_-1px_6px_rgba(255,255,255,0.4),inset_3px_3px_10px_rgba(0,0,0,1),inset_-1px_-1px_6px_rgba(255,255,255,0.4)]"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Confirm Password</span>
                                </label>
                                <div className="relative mt-2">
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

                            <div className="mt-2 mb-4">
                                <input type="checkbox" name="terms" id="terms" />
                                <label className="ml-2 mb-4" htmlFor="terms">
                                    Accept our{" "}
                                    <a href="#" className="text-blue-600 hover:underline">
                                        terms and Conditions
                                    </a>
                                </label>
                            </div>

                            <div className="form-control mt-2">
                                <input
                                    className="w-full p-2 cursor-pointer rounded-md bg-[#3734ff] hover:bg-[#161551] transition text-xl font-bold mb-2 text-white shadow-xl"
                                    type="submit"
                                    value="Sign Up"
                                />
                            </div>
                            {/* have a account login */}
                            <div className="flex mt-2 mb-5 justify-center">
                                <Link to="/login" className="text-blue-600 hover:underline">
                                    Already have an account? <span className="text-red-500 hover:underline font-bold">Login</span>
                                </Link>
                            </div>
                            

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
