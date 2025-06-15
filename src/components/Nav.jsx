import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser")
    navigate("/login/student")
  }

  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-3">
        <img
          src="https://cdn.tuwaiq.edu.sa/landing/images/logo/logo-noname.png"
          alt="logo"
          className="w-10 h-10 object-cover rounded-full"
        />
        <h1 className="text-xl font-bold text-indigo-700">Graduation Manager</h1>
      </div>

      <div className="hidden md:flex gap-6 items-center">
        {/* <Link to="/" className="text-gray-700 hover:text-indigo-700">Home</Link> */}

        {/* {user?.role === "admin" && (
          <Link to="/dashboard/admin" className="text-gray-700 hover:text-indigo-700">Admin Panel</Link>
        )} */}

        {/* {user?.role === "student" && (
          <Link to="/" className="text-gray-700 hover:text-indigo-700">Student Dashboard</Link>
        )} */}

        {/* {user?.role === "teacher" && (
          <Link to="/dashboard/teacher" className="text-gray-700 hover:text-indigo-700">Teacher Dashboard</Link>
        )} */}
      </div>

      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-500">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login/student"
              className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800"
            >
              Login
            </Link>
            <Link
              to="/register/student"
              className="text-indigo-700 border border-gray-300 px-4 py-2 rounded hover:text-indigo-800"
            >
              Register
            </Link>
          </>
        )}
      </div>

      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <FaTimes className="w-6 h-6 text-gray-700" />
          ) : (
            <FaBars className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 md:hidden">
          {/* <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-indigo-700">Home</Link> */}

          {/* {user?.role === "admin" && (
            <Link to="/dashboard/admin" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-indigo-700">Admin Panel</Link>
          )} */}

          {/* {user?.role === "student" && (
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-indigo-700">Student Dashboard</Link>
          )} */}

          {/* {user?.role === "teacher" && (
            <Link to="/dashboard/teacher" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-indigo-700">Teacher Dashboard</Link>
          )} */}

          {user ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="text-gray-700 hover:text-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login/student" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-indigo-700">Login</Link>
              <Link to="/register/student" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-indigo-700">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
