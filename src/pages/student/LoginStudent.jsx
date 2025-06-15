import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function LoginStudent() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

    if (password.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password is required.',
      })
      return
    }

    try {
      const res = await axios.get("https://6837ad992c55e01d184a8113.mockapi.io/users")
      const users = res.data

      const user = users.find(u =>
        u.email === email &&
        u.password === password &&
        u.role === "student"
      )

      if (!user) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid student credentials.',
        })
        return
      }

      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Signed in as student.',
      })

      localStorage.setItem("loggedUser", JSON.stringify(user))
      setEmail("")
      setPassword("")
      navigate("/")

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Could not connect to the server.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center px-4">
      <div className="p-6 md:max-w-md w-full bg-white rounded-xl shadow-xl">
        <img 
          src="https://cdn.tuwaiq.edu.sa/landing/images/logo/logo-h.png"  
          alt="Tuwaiq Logo" 
          className="w-72 mx-auto mb-4"
        /> 
        <p className="text-2xl font-bold text-indigo-800 mb-6 text-center">Student Login</p>

        <form onSubmit={submit}>
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
            className='border rounded p-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400'
          />

          <button
            type="submit"
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded'>
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?
          <a href="/register/student" className="text-indigo-600 font-medium hover:underline ml-1">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
