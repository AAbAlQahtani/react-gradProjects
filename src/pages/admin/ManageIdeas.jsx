import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

export default function ManageIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const navigate = useNavigate();

  const ideaUrl = "https://6837ad992c55e01d184a8113.mockapi.io/ideas"
  const userUrl = "https://6837ad992c55e01d184a8113.mockapi.io/users"

  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem("loggedUser"))
    if (!logged || logged.role !== "admin") {
      navigate("/login/Staff")
    } else {
      getAll()
    }
  }, [])

  const getAll = async () => {
    const ideaRes = await axios.get(ideaUrl);
    const userRes = await axios.get(userUrl);
    setIdeas(ideaRes.data)
    setUsers(userRes.data)
  };

  const changeStatus = (id, status) => {
    if (status === "rejected") {
      Swal.fire({
        title: "Reject Reason",
        input: "text",
        inputPlaceholder: "Enter reason",
        showCancelButton: true,
        confirmButtonText: "Submit",
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          axios.put(`${ideaUrl}/${id}`, { status, reason: result.value }).then(getAll)
        }
      });
    } else {
      axios.put(`${ideaUrl}/${id}`, { status }).then(getAll)
    }
  };

  const deleteIdea = (id) => {
    Swal.fire({
      title: "Delete?",
      text: "This will delete the idea.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) {
        axios.delete(`${ideaUrl}/${id}`).then(getAll)
      }
    });
  };

  const startEdit = (id, title, description) => {
    setEditingId(id);
    setEditedTitle(title);
    setEditedDescription(description)
  }

  const saveTitle = (id) => {
    axios
      .put(`${ideaUrl}/${id}`, { title: editedTitle, description: editedDescription })
      .then(() => {
        setEditingId(null)
        setEditedTitle("")
        setEditedDescription("")
        getAll()
      })
  }

  const getStudentName = (id) => {
    const student = users.find((u) => u.id === id)
    return student ? student.name : "Unknown"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-600 mb-4 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">Manage Project Ideas</h2>

      <div className="grid gap-6">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white shadow p-4 rounded-lg flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center"
          >
            <div className="flex-1">
              {editingId === idea.id ? (
                <>
                  <input
                    type="text"
                    className="border rounded p-2 w-full mb-2"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />

                  <textarea
                    className="border rounded p-2 w-full mb-2"
                    value={editedDescription}
                    rows={3}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />

                </>
              ) : (
                <>
                  <p className="text-lg font-semibold">{idea.title}</p>
                  <p className="text-sm text-gray-600 mb-1">{idea.description}</p>
                </>
              )}
              
              <p className="text-sm text-gray-600">
                By: <span className="font-medium">{getStudentName(idea.ownerId)}</span>
              </p>

              <p className="text-sm">
                Status:{" "}
               
                <span
                  className={`font-semibold ${
                    idea.status === "accepted"
                      ? "text-green-600"
                      : idea.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >

                  {idea.status}
                </span>
             
              </p>
              {idea.reason && (
                <p className="text-xs text-red-500">Reason: {idea.reason}</p>
              )}

            </div>

            {idea.status === "pending" && (
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 sm:ml-4">
                {editingId === idea.id ? (
                  <button
                    onClick={() => saveTitle(idea.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Save  </button>

                ) : (
                  <button
                    onClick={() => startEdit(idea.id, idea.title, idea.description)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Edit </button>

                )}
                <button
                  onClick={() => changeStatus(idea.id, "accepted")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Accept </button>

                <button
                  onClick={() => changeStatus(idea.id, "rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject </button>

              </div>
            )}

            <button
              onClick={() => deleteIdea(idea.id)}
              className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 mt-2 sm:mt-0 sm:ml-2"
            >
              Delete </button>
          </div>
        ))}
      </div>
    </div>
  )
}
