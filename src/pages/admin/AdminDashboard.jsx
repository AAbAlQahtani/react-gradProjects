import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    AiOutlineBulb,
    AiOutlineCheckCircle,
    AiOutlineClockCircle,
    AiOutlineCloseCircle,
    AiOutlineUser,
    AiOutlineTeam,
    AiOutlineUserAdd,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
    const [ideas, setIdeas] = useState([])
    const [users, setUsers] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("loggedUser"));
        if (!logged || logged.role !== "admin") {
            navigate("/login/Staff")
        } else {
            fetchData()
        }
    }, [])

    const fetchData = async () => {
        const ideasRes = await axios.get("https://6837ad992c55e01d184a8113.mockapi.io/ideas")
        const usersRes = await axios.get("https://6837ad992c55e01d184a8113.mockapi.io/users")

        setIdeas(ideasRes.data)
        setUsers(usersRes.data)
    };

    const ideaStats = {
        total: ideas.length,
        accepted: ideas.filter((i) => i.status === "accepted").length,
        pending: ideas.filter((i) => i.status === "pending").length,
        rejected: ideas.filter((i) => i.status === "rejected").length,
    };

    const userStats = {
        students: users.filter((u) => u.role === "student").length,
        teachers: users.filter((u) => u.role === "teacher").length,
        admins: users.filter((u) => u.role === "admin").length,
    };

    const StatCard = ({ title, count, icon, color }) => (
        <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-${color}-500 flex items-center gap-4`}>
            <div className={`text-4xl text-${color}-500`}>{icon}</div>
            <div>
                <h3 className="text-sm text-gray-500">{title}</h3>
                <p className={`text-3xl font-bold text-${color}-700`}>{count}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
            <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
                <StatCard
                    title="Total Ideas"
                    count={ideaStats.total}
                    icon={<AiOutlineBulb className="text-blue-700" />}
                    color="blue"
                />
                <StatCard
                    title="Accepted Ideas"
                    count={ideaStats.accepted}
                    icon={<AiOutlineCheckCircle className="text-green-700" />}
                    color="green"
                />
                <StatCard
                    title="Pending Ideas"
                    count={ideaStats.pending}
                    icon={<AiOutlineClockCircle className="text-yellow-700" />}
                    color="yellow"
                />
                <StatCard
                    title="Rejected Ideas"
                    count={ideaStats.rejected}
                    icon={<AiOutlineCloseCircle className="text-red-700" />}
                    color="red"
                />
                <StatCard
                    title="Students"
                    count={userStats.students}
                    icon={<AiOutlineUser className="text-purple-800" />}
                    color="purple"
                />
                <StatCard
                    title="Teachers"
                    count={userStats.teachers}
                    icon={<AiOutlineTeam className="text-indigo-700" />}
                    color="indigo"
                />
                <StatCard
                    title="Admins"
                    count={userStats.admins}
                    icon={<AiOutlineUser className="text-gray-800" />}
                    color="gray"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <Link
                    to="/admin/users"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow flex items-center justify-center gap-2"
                >
                    <AiOutlineTeam className="text-xl" />
                    Manage Users
                </Link>

                <Link
                    to="/admin/ideas"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl shadow flex items-center justify-center gap-2"
                >
                    <AiOutlineBulb className="text-xl" />
                    Manage Ideas
                </Link>

                <Link
                    to="/admin/add-user"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl shadow flex items-center justify-center gap-2"
                >
                    <AiOutlineUserAdd className="text-xl" />
                    Add New User
                </Link>
            </div>
        </div>
    );
}
