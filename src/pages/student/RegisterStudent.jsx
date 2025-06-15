import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function RegisterStudent() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    const submit = async (e) => {
        e.preventDefault()

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Invalid email format.',
            })
            return
        }

        if (!email.toLowerCase().includes("tuwaiq")) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Email must contain "tuwaiq".',
            })
            return
        }

        if (password.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Password is required.',
            })
            return
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Passwords do not match.',
            })
            return
        }

        if (name.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Name is required.',
            })
            return
        }

        try {
            await axios.post("https://6837ad992c55e01d184a8113.mockapi.io/users", {
                name,
                email,
                password,
                role: "student"
            })

            Swal.fire({
                icon: 'success',
                title: 'Account Created!',
                text: 'You can now log in.',
            })

            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            navigate("/login/student")

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Could not register user.',
            })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center px-4">
            <div className="p-6 md:max-w-md w-full bg-white rounded-xl shadow-xl">
                
                <img
                    src="https://cdn.tuwaiq.edu.sa/landing/images/logo/logo-h.png"
                    alt="Tuwaiq Logo"
                    className="w-72 mx-auto "
                />
                
                <p className="text-2xl font-bold text-indigo-700 mb-6 text-center">Student Register</p>

                <form onSubmit={submit}>
                    <label className="block font-semibold mb-1 text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className='border rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400'
                    />

                    <label className="block font-semibold mb-1 text-gray-700">Email</label>
                   
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@tuwaiq.edu.sa"
                        className='border rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400'
                    />

                    <label className="block font-semibold mb-1 text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className='border rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400'
                    />

                    <label className="block font-semibold mb-1 text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className='border rounded p-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400'
                    />

                    <button
                        type="submit"
                        className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded'>
                        Register
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-6">
                    Already have an account?
                    <a href="/login/student" className="text-indigo-600 font-medium hover:underline ml-1">
                        Login
                    </a>
                </p>
            </div>
        </div>
    )
}
