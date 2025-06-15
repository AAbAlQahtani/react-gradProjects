import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";


export default function AssignStudentToTeacher() {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("")
    const [selectedTeacher, setSelectedTeacher] = useState("")
    const navigate = useNavigate()


    const url = "https://6837ad992c55e01d184a8113.mockapi.io/users"

    useEffect(() => {
        const logged = JSON.parse(localStorage.getItem("loggedUser"))
        if (!logged || logged.role !== "admin") {
            navigate("/login/Staff")
        } else {
            axios.get(url).then((res) => {
                const all = res.data;
                setStudents(all.filter((u) => u.role === "student"))
                setTeachers(all.filter((u) => u.role === "teacher"))
            })
        }
    }, []);

    const handleAssign = async () => {
        if (!selectedStudent || !selectedTeacher) {
            Swal.fire("Error", "Please select both student and teacher", "error")
            return
        }

        try {
            await axios.put(`${url}/${selectedStudent}`, {
                assignedTeacherId: selectedTeacher,
            });

            Swal.fire("Success", "Student assigned to teacher successfully", "success");
            setSelectedStudent("")
            setSelectedTeacher("")
            navigate("/admin/users")

        } catch (error) {
            Swal.fire("Error", "Failed to assign student", "error")
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-indigo-600 mb-4 hover:underline"
                >
                    <FaArrowLeft className="mr-2" /> Back</button>

                <h2 className="text-xl font-bold text-center text-indigo-700-700 mb-6">
                    Assign Student to Teacher
                </h2>

                <label className="block mb-1 font-medium text-gray-700">Select Student:</label>
                <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                >
                    <option value="">-- Select Student --</option>
                    {students.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>

                <label className="block mb-1 font-medium text-gray-700">Select Teacher:</label>
               
                <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full p-2 border rounded mb-6"
                >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleAssign}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                    Assign </button>
            </div>
        </div>
    );
}
