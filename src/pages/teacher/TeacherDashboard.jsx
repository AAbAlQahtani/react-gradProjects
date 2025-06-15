import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
    const [teacher, setTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [teams, setTeams] = useState([]);

    const usersUrl = "https://6837ad992c55e01d184a8113.mockapi.io/users"
    const ideasUrl = "https://6837ad992c55e01d184a8113.mockapi.io/ideas"
    const teamsUrl = "https://683cc42f199a0039e9e35f20.mockapi.io/teams"

    const navigate = useNavigate()

    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("loggedUser"))
        if (!logged || logged.role !== "teacher") {
            navigate("/login/Staff")
        } else {
            setTeacher(logged)
            fetchStudentsAndIdeas(logged.id)
            fetchTeams(logged.id)
        }
    }, []);

    const fetchStudentsAndIdeas = async (teacherId) => {
        const res = await axios.get(usersUrl)
        const assigned = res.data.filter(
            (u) => u.role === "student" && u.assignedTeacherId === teacherId
        )
        setStudents(assigned)
        fetchIdeas(assigned)
    }

    const fetchIdeas = async (studentList) => {
        const res = await axios.get(ideasUrl)
        const allIdeas = res.data;
        const filteredIdeas = allIdeas.filter(
            (idea) => idea.ownerId && studentList.some((s) => s.id === idea.ownerId)
        );
        setIdeas(filteredIdeas)
    };

    const fetchTeams = async (teacherId) => {
        const res = await axios.get(teamsUrl)
        const filtered = res.data.filter((team) => team.teacherId === teacherId)
        setTeams(filtered)
    }

    const updateIdeaStatus = async (id, status) => {
        if (status === "rejected") {
            const { isConfirmed, value } = await Swal.fire({
                title: "Reason for rejection",
                input: "text",
                inputPlaceholder: "Enter reason...",
                showCancelButton: true,
                confirmButtonText: "Submit",
                inputValidator: (value) => {
                    if (!value.trim()) return "Rejection reason is required.";
                    return null
                },
            })

            if (!isConfirmed) return



            try {
                await axios.put(`${ideasUrl}/${id}`, { status, reason: value })
                Swal.fire("Updated!", "Idea has been rejected.", "success")
                fetchStudentsAndIdeas(teacher.id)
            } catch {
                Swal.fire("Error", "Failed to update idea.", "error")
            }

        } else if (status === "accepted") {
            const { isConfirmed, value } = await Swal.fire({
                title: "Optional note for acceptance",
                input: "text",
                inputPlaceholder: "You may leave this blank...",
                showCancelButton: true,
                confirmButtonText: "Submit",
            });

            if (!isConfirmed) return

            try {
                await axios.put(`${ideasUrl}/${id}`, { status, reason: value || "" })
                Swal.fire("Updated!", "Idea has been accepted.", "success")
                fetchStudentsAndIdeas(teacher.id)
            } catch {
                Swal.fire("Error", "Failed to update idea.", "error")
            }
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-tr from-blue-50 to-purple-100">
            <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">
                Teacher Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
                        Your Students
                    </h3>
                    {students.length === 0 ? (
                        <p className="text-gray-500">No assigned students.</p>
                    ) : (
                        <ul className="space-y-2">
                            {students.map((s) => (
                                <li key={s.id} className="text-gray-700 font-medium">
                                    {s.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                       
                        <h3 className="text-2xl font-semibold text-indigo-700">
                            Your Teams
                        </h3>
                        
                        <button
                            onClick={() => navigate("/dashboard/create-team")}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Create Team
                        </button>
                    </div>
                   
                    {teams.length === 0 ? (
                        <p className="text-gray-500">No teams created yet.</p>
                    ) : (
                        <ul className="space-y-2">
                          
                            {teams.map((team) => (
                                <li key={team.id} className="text-gray-700 font-medium">
                                    <p className="font-semibold">{team.name}</p>
                                    <ul className="pl-4 text-sm text-gray-600 list-disc">
                                        {team.studentIds && team.studentIds.length > 0 ? (
                                            team.studentIds.map((memberId) => {
                                                const student = students.find((s) => s.id === memberId);
                                                return <li key={memberId}>{student?.name || "Unknown"}</li>;
                                            })
                                        ) : (
                                            <li>No members</li>
                                        )}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                
                <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
                    Team Ideas
                </h3>
                
                {ideas.length === 0 ? (
                    <p className="text-gray-500">No ideas submitted yet.</p>
                ) : (
                    <div className="space-y-4">
                        {ideas.map((idea) => (
                           
                           <div
                                key={idea.id}
                                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                            >
                                <p className="text-lg font-medium text-gray-800 mb-1">{idea.title}</p>
                               
                                <p className="text-sm text-gray-600 mb-1">{idea.description || "No description provided."}</p>
                                <p className="text-sm text-gray-500 italic mb-2">
                                    By: {students.find((s) => s.id === idea.ownerId)?.name || "Unknown"}
                                </p>
                                <div className="flex justify-between items-center">
                                   
                                    <p className="text-sm text-gray-600 capitalize">
                                        Status:{" "}
                                        <span
                                            className={`font-semibold ${idea.status === "accepted"
                                                ? "text-green-600"
                                                : idea.status === "rejected"
                                                    ? "text-red-600"
                                                    : "text-yellow-600"
                                                }`}
                                        >
                                            {idea.status}
                                        </span>
                                    </p>

                                    {idea.status === "pending" && (
                                       
                                       <div className="space-x-2">
                                            <button
                                                onClick={() => updateIdeaStatus(idea.id, "accepted")}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => updateIdeaStatus(idea.id, "rejected")}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                               
                                {idea.reason && (
                                    <p className="text-xs text-gray-500 mt-1">Reason: {idea.reason}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
