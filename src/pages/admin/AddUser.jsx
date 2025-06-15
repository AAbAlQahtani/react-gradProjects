import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


export default function AddUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const URL = "https://6837ad992c55e01d184a8113.mockapi.io/users"
    const navigate = useNavigate()


    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("loggedUser"));
        if (!logged || logged.role !== "admin") {
            navigate("/login/Staff")
        }
    }, [])

    const submit = async (e) => {
        e.preventDefault()

        if (!name.trim() || !email.trim() || !password.trim()) {
            Swal.fire("Error", "All fields are required.", "error");
            return
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(email)) {
            Swal.fire("Error", "Invalid email format.", "error")
            return
        }

        const emailExists = await axios.get(URL).then((res) =>
            res.data.some((user) => user.email.toLowerCase() === email.toLowerCase())
        );

        if (emailExists) {
            Swal.fire("Error", "Email is already registered", "error")
            return
        }

        if (role === "student" && !email.toLowerCase().includes("tuwaiq")) {
            Swal.fire("Error", "Student email must contain 'tuwaiq'.", "error")
            return
        }

        try {
            await axios.post("https://6837ad992c55e01d184a8113.mockapi.io/users", {
                name,
                email,
                password,
                role,
            })

            Swal.fire("Success", `${role} account created successfully.`, "success");
            setName("");
            setEmail("");
            setPassword("");
            setRole("student");
            navigate("/dashboard/admin");

        } catch (error) {
            Swal.fire("Error", "Failed to create account.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center px-4 py-10">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-indigo-600 mb-4 hover:underline"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </button>
               
                <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
                    Add New User
                </h2>

                
                <form onSubmit={submit}>
                    <label className="block mb-1 font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded p-2 mb-4"
                    />

                    <label className="block mb-1 font-medium text-gray-700">Email</label>
                    
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded p-2 mb-4"
                    />

                    <label className="block mb-1 font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded p-2 mb-4"
                    />

                    
                    <label className="block mb-1 font-medium text-gray-700">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border rounded p-2 mb-6"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Create Account </button>

                </form>
            </div>
        </div>
    );
}
