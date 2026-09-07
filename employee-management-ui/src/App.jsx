import { useEffect, useState } from 'react'
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom'
import './App.css'
import { login } from './services/authService'
import EmployeeDashboard from './EmployeeDashboard.jsx'

function App() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [employees, setEmployees] = useState([])
    const [email, setEmail] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [employeeEmail, setEmployeeEmail] = useState('')
    const [department, setDepartment] = useState('')
    const [isAddingEmployee, setIsAddingEmployee] = useState(false)
    const [editingEmployeeId, setEditingEmployeeId] = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const data = await login(username, password)

            console.log("Login successful:", data)

            localStorage.setItem("token", data.token)
            setIsLoggedIn(true)

            alert("Login successful!")
            navigate("/dashboard")
        }
        catch (error) {
            console.error("Login error:", error)
            alert(error.message || "Unable to connect to the server.")
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(
                "https://localhost:7079/api/Auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                alert(data.message || "Registration failed")
                return
            }

            console.log("Registration successful:", data)

            alert("Registration successful!")

            setIsRegistering(false)
            setUsername('')
            setEmail('')
            setPassword('')
        }
        catch (error) {
            console.error("Registration error:", error)
            alert("Unable to connect to the server.")
        }
    }

    const handleEditEmployee = (employee) => {
        setFirstName(employee.firstName)
        setLastName(employee.lastName)
        setEmployeeEmail(employee.email)
        setDepartment(employee.department)

        setEditingEmployeeId(employee.id)
        setIsAddingEmployee(true)
    }

    const handleUpdateEmployee = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem("token")

        try {
            const response = await fetch(
                `https://localhost:7079/api/Employee/${editingEmployeeId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        email: employeeEmail,
                        department: department
                    })
                }
            )

            if (!response.ok) {
                const errorText = await response.text()

                console.error("Update failed:", errorText)

                alert("Failed to update employee")
                return
            }

            console.log("Employee updated successfully")

            alert("Employee updated successfully!")

            setFirstName('')
            setLastName('')
            setEmployeeEmail('')
            setDepartment('')
            setEditingEmployeeId(null)
            setIsAddingEmployee(false)

            getEmployees()
        }
        catch (error) {
            console.error("Update employee error:", error)
            alert("Unable to connect to the server.")
        }
    }

    const handleDeleteEmployee = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        )

        if (!confirmDelete) {
            return
        }

        const token = localStorage.getItem("token")

        try {
            const response = await fetch(
                `https://localhost:7079/api/Employee/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                const errorText = await response.text()

                console.error("Delete failed:", errorText)

                alert("Failed to delete employee")
                return
            }

            alert("Employee deleted successfully!")

            getEmployees()
        }
        catch (error) {
            console.error("Delete employee error:", error)
            alert("Unable to connect to the server.")
        }
    }

    const handleAddEmployee = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem("token")

        try {
            const response = await fetch(
                "https://localhost:7079/api/Employee",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        email: employeeEmail,
                        department: department
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                alert("Failed to add employee")
                console.log(data)
                return
            }

            console.log("Employee added:", data)

            alert("Employee added successfully!")

            setFirstName('')
            setLastName('')
            setEmployeeEmail('')
            setDepartment('')
            setIsAddingEmployee(false)

            getEmployees()
        }
        catch (error) {
            console.error("Add employee error:", error)
            alert("Unable to connect to the server.")
        }
    }

    const getEmployees = async () => {
        const token = localStorage.getItem("token")

        try {
            const response = await fetch(
                "https://localhost:7079/api/Employee",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {
                alert("Failed to get employees")
                console.log(data)
                return
            }

            console.log("Employees:", data)

            setEmployees(data)
        }
        catch (error) {
            console.error("Employee API error:", error)
            alert("Unable to connect to the server.")
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        setIsLoggedIn(false)
        setEmployees([])
        setUsername('')
        setPassword('')
        setIsAddingEmployee(false)
        setEditingEmployeeId(null)

        alert("Logged out successfully!")
        navigate("/")
    }
                    
    return (
    <Routes>
        <Route
            path="/"
            element={
                <div className="login-container">
            <div className="login-card">

                <h1>Employee Management</h1>

                <p className="subtitle">
                    {isRegistering
                        ? "Create your account"
                        : "Login to your account"}
                </p>

                <div className="form-group">
                    <label>Username</label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {isRegistering && (
                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="button-container">

                    {!isLoggedIn ? (

                        isRegistering ? (

                            <button onClick={handleRegister}>
                                Register
                            </button>

                        ) : (

                            <button onClick={handleLogin}>
                                Login
                            </button>

                        )

                    ) : (

                        <>
                            <button onClick={getEmployees}>
                                Get Employees
                            </button>

                            <button onClick={() => setIsAddingEmployee(true)}>
                                Add Employee
                            </button>

                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </>

                    )}

                </div>

                {!isLoggedIn && (
                    <p className="register-text">

                        Don't have an account?{" "}

                        <span
                            onClick={() => setIsRegistering(!isRegistering)}
                        >
                            {isRegistering ? "Login" : "Register"}
                        </span>

                    </p>
                )}

            </div>

            {isAddingEmployee && (
                <div className="login-card">

                    <h2>
                        {editingEmployeeId
                            ? "Update Employee"
                            : "Add Employee"}
                    </h2>

                    <div className="form-group">
                        <label>First Name</label>

                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>

                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={employeeEmail}
                            onChange={(e) => setEmployeeEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Department</label>

                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </div>

                    {editingEmployeeId ? (

                        <button onClick={handleUpdateEmployee}>
                            Update Employee
                        </button>

                    ) : (

                        <button onClick={handleAddEmployee}>
                            Add Employee
                        </button>

                    )}

                    <button
                        onClick={() => {
                            setIsAddingEmployee(false)
                            setEditingEmployeeId(null)
                        }}
                    >
                        Cancel
                    </button>

                </div>
            )}

            {employees.length > 0 && (

                <div className="employee-section">

                    <h2>Employee List</h2>

                    <table className="employee-table">

                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Action</th>
                            </tr> 
                        </thead>

                        <tbody>

                            {employees.map((employee) => (

                                <tr key={employee.id}>

                                    <td>{employee.firstName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.department}</td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                handleEditEmployee(employee)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteEmployee(employee.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )} 

          </div>
            }
        />

        <Route
                path="/dashboard"
                element={
                    localStorage.getItem("token")
                        ? <EmployeeDashboard onLogout={handleLogout} />
                        : <Navigate to="/" replace />
                }
        />

        <Route
            path="*"
            element={<Navigate to="/" replace />}
        />
    </Routes>
)
}

export default App