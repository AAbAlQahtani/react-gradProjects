import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";


export default function CreateTeam() {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [teacher, setTeacher] = useState(null);

    const usersUrl = "https://6837ad992c55e01d184a8113.mockapi.io/users"
    const teamsUrl = "https://683cc42f199a0039e9e35f20.mockapi.io/teams"
    const navigate = useNavigate()

    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("loggedUser"));
        if (!logged || logged.role !== "teacher") {
            navigate("/login/Staff");
        } else {
            setTeacher(logged);
            fetchStudents(logged.id);
        }
    }, [])

    const fetchStudents = async (teacherId) => {
        try {
            const usersRes = await axios.get(usersUrl)
            const teamsRes = await axios.get(teamsUrl)

            const allUsers = usersRes.data;
            const allTeams = teamsRes.data;

            const assignedStudents = allUsers.filter(
                (u) => u.role === "student" && u.assignedTeacherId === teacherId
            )

            const studentIdsInTeams = new Set()
            allTeams.forEach((team) => {
                team.studentIds.forEach((id) => studentIdsInTeams.add(id))
            })

            const availableStudents = assignedStudents.filter(
                (student) => !studentIdsInTeams.has(student.id)
            )

            setStudents(availableStudents);
        } catch (error) {
            Swal.fire("Error", "Failed to load students or teams.", "error")
        }
    }

    const toggleStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter((s) => s !== id))
        } else {
            setSelectedStudents([...selectedStudents, id])
        }
    };

    const createTeam = async () => {
        if (!teamName.trim() || selectedStudents.length === 0) {
            Swal.fire("Error", "Enter a team name and select students.", "error")
            return
        }

        try {
           
            await axios.post(teamsUrl, {
                name: teamName,
                teacherId: teacher.id,
                studentIds: selectedStudents,
            })
           
            Swal.fire("Success", "Team created successfully!", "success");
            setTeamName("");
            setSelectedStudents([]);
            navigate("/dashboard/teacher");
       
        } catch (error) {

            Swal.fire("Error", "Failed to create team.", "error");
        }
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 to-blue-100">
           
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 mb-4 hover:underline"
            >
                <FaArrowLeft className="mr-2" /> Back
            </button>
           
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Create Team</h2>

            <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
                <label className="block mb-2 font-medium text-gray-700">Team Name</label>
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    placeholder="Enter team name"
                />

                <label className="block mb-2 font-medium text-gray-700">Select Students</label>

                
                {students.length === 0 ? (
                    <p className="text-gray-500 mb-4">No students available to create a team.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto mb-4">
                        {students.map((student) => (
                            <label key={student.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => toggleStudent(student.id)}
                                />
                                <span>{student.name}</span>
                            </label>
                        ))}
                    </div>
                )}

                <button
                    onClick={createTeam}
                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                >
                    Create Team
                </button>
            </div>
        </div>
    )
}
