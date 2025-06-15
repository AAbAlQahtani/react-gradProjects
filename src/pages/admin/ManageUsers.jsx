import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [teachers, setTeachers] = useState([]);
    const navigate = useNavigate()

    const url = "https://6837ad992c55e01d184a8113.mockapi.io/users"

    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("loggedUser"))
        if (!logged || logged.role !== "admin") {
            navigate("/login/Staff")
        } else {
            getUsers()
        }
    }, []);

    const getUsers = async () => {
        const res = await axios.get(url)
        setUsers(res.data);
        setTeachers(res.data.filter((u) => u.role === "teacher"))
    }

    const deleteUser = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete the user permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it",
        })

        if (confirm.isConfirmed) {
            await axios.delete(`${url}/${id}`)
            Swal.fire("Deleted!", "User has been deleted.", "success")
            getUsers()
        }
    };

    const filteredUsers = users.filter((u) => {
        const name = u.name || ""
        return name.toLowerCase().includes(search.toLowerCase())
    })

    const getTeacherName = (teacherId) => {
        const teacher = teachers.find((t) => t.id === teacherId)
        return teacher ? teacher.name : "-"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-indigo-600 mb-4 hover:underline"
            >

                <FaArrowLeft className="mr-2" /> Back
            </button>
            
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
                Manage Users
            </h2>

            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded w-1/2"
                />
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate("/admin/assign")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Assign Student to Teacher
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto bg-white rounded shadow">
                    <thead>
                        <tr className="bg-indigo-600 text-white">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Role</th>
                            <th className="p-2">Assigned Teacher</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="text-center border-t">
                                <td className="p-2">{user.name}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2 capitalize">{user.role}</td>
                                <td className="p-2">
                                    {user.role === "student" ? getTeacherName(user.assignedTeacherId) : "-"}
                                </td>
                                <td className="p-2">
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-4 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
