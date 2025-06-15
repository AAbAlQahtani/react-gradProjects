import React from 'react'
import Nav from "../components/Nav";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet
} from "react-router-dom";
import LoginStaff from '../pages/admin/LoginStaff';
import LoginStudent from '../pages/student/LoginStudent';
import RegisterStudent from '../pages/student/RegisterStudent';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageIdeas from '../pages/admin/ManageIdeas';
import AddUser from '../pages/admin/AddUser';
import ManageUsers from '../pages/admin/ManageUsers';
import AssignStudentToTeacher from '../pages/admin/AssignStudentToTeacher';
import StudentDashboard from '../pages/student/StudentDashboard';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import CreateTeam from '../pages/teacher/CreateTeam';

// import Login from '../pages/Login';
// import Register from '../pages/Register';
// import Home from '../pages/Home';
import Footer from '../components/Footer';
// import AdminPage from '../pages/AdminPage';
// import UserPage from '../pages/UserPage';

function Layout() {
    return (

        <>
            <Nav />
            <Outlet />
            <Footer />
        </>

    );


}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            // { path: "/", element: <Home /> },
            { path: "/dashboard/admin", element: <AdminDashboard /> },
            { path: "/admin/ideas", element: <ManageIdeas /> },
            { path: "/admin/Users", element: <ManageUsers /> },
            { path: "admin/add-user", element: <AddUser /> },
            { path: "/admin/assign", element: <AssignStudentToTeacher /> },
            { path: "/", element: <StudentDashboard /> },

            { path: "/dashboard/create-team", element: <CreateTeam /> },


            { path: "/dashboard/teacher", element: <TeacherDashboard /> },


        ],
    },
    { path: "/login/Staff", element: <LoginStaff /> },
    { path: "/login/student", element: <LoginStudent /> },
    { path: "/register/student", element: <RegisterStudent /> },
]);


export default function Router() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

