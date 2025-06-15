import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUser, FaLightbulb, FaUsers, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
    const [user, setUser] = useState(null);
    const [ideas, setIdeas] = useState([]);
    const [approvedIdeas, setApprovedIdeas] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [team, setTeam] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [teacherName, setTeacherName] = useState("");
    const navigate = useNavigate();

    const usersUrl = "https://6837ad992c55e01d184a8113.mockapi.io/users"
    const ideasUrl = "https://6837ad992c55e01d184a8113.mockapi.io/ideas"
    const teamsUrl = "https://683cc42f199a0039e9e35f20.mockapi.io/teams"

    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("loggedUser"));
        if (!logged || logged.role !== "student") {
            navigate("/login/student")
        } else {
            setUser(logged)
            fetchIdeas(logged.id)
            fetchTeam(logged.id)
            fetchTeacher(logged.assignedTeacherId)
        }
    }, []);

    const fetchIdeas = async (studentId) => {
        const res = await axios.get(ideasUrl);
        const all = res.data;
        setApprovedIdeas(all.filter((idea) => idea.status === "accepted"))
        setIdeas(all.filter((idea) => idea.ownerId === studentId))
    };

    const fetchTeam = async (studentId) => {
        const res = await axios.get(teamsUrl)
        const studentTeam = res.data.find((team) => team.studentIds.includes(studentId))
        if (studentTeam) {
            setTeam(studentTeam);
            const memberData = await axios.get(usersUrl)
            const members = memberData.data.filter((u) => studentTeam.studentIds.includes(u.id))
            setTeamMembers(members);
        }
    };

    const fetchTeacher = async (teacherId) => {
        if (!teacherId) return;
        try {
            const res = await axios.get(`${usersUrl}/${teacherId}`)
            setTeacherName(res.data.name)
        } catch {
            setTeacherName("Unknown")
        }
    }

    const submitIdea = async () => {
        if (!title.trim() || !description.trim()) {
            Swal.fire("Error", "Please enter both title and description.", "error");
            return
        }

        await axios.post(ideasUrl, {
            title,
            description,
            status: "pending",
            ownerId: user.id,
        })

        Swal.fire("Submitted", "Idea sent for approval.", "success");
        setTitle("");
        setDescription("");
        fetchIdeas(user.id);
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-100 to-blue-100">
            <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">Student Dashboard</h2>

            {user && (
                <div className="mb-6 text-center">
                    <p className="text-lg text-gray-700 mb-1">Welcome <strong>{user.name}</strong></p>
                    <p className="text-sm text-gray-600">
                        Assigned Teacher: <span className="font-medium text-indigo-600">{teacherName || "Not assigned yet"}</span>
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl shadow">
                    
                    <h3 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
                        <FaLightbulb /> Submit New Idea </h3>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border p-2 rounded mb-2"
                        placeholder="Enter idea title"
                    />


                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border p-2 rounded mb-2"
                        placeholder="Enter idea description"
                        rows="3"
                    ></textarea>

                    <button
                        onClick={submitIdea}
                        className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
                    >
                        Submit
                    </button>

                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
                        <FaUsers /> Your Team
                    </h3>
                    {team ? (
                        <>
                            <p className="font-medium mb-1">Team: {team.name}</p>
                            <p className="text-sm text-gray-600 mb-3">{team.description}</p>
                            <h4 className="text-md font-semibold mb-1">Members:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {teamMembers.map((member) => (
                                    <li key={member.id}>{member.name} ({member.email})</li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-gray-500">You are not part of any team.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow">
                    <h3 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
                        <FaCheckCircle /> Your Ideas & Status
                    </h3>
                    {ideas.length === 0 ? (
                        <p className="text-gray-500">No ideas submitted yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {ideas.map((idea) => (
                                <div
                                    key={idea.id}
                                    className="p-3 border rounded-lg bg-gray-50"
                                >
                                    <p className="font-medium">{idea.title}</p>
                                    <p className="text-sm text-gray-500">{idea.description}</p>
                                   
                                    <span
                                        className={`text-xs mt-1 inline-block font-medium px-2 py-1 rounded ${idea.status === "accepted"
                                            ? "bg-green-100 text-green-700"
                                            : idea.status === "rejected"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {idea.status}
                                    </span>
                                    
                                    {idea.reason && (
                                        <p className="text-xs text-gray-600 mt-1 italic">Reason: {idea.reason}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    
                    <h3 className="text-xl font-semibold text-indigo-600 mb-4">All Approved Ideas</h3>
                    
                    {approvedIdeas.length === 0 ? (
                        <p className="text-gray-500">No approved ideas yet.</p>
                    ) : (
                        <ul className="list-disc pl-5 space-y-1">
                            {approvedIdeas.map((idea) => (
                                <li key={idea.id}>{idea.title}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
