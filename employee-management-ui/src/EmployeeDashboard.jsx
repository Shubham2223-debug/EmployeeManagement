import { useEffect, useState } from 'react'

function EmployeeDashboard({ onLogout }) {
    const [employees, setEmployees] = useState([])
    const [department, setDepartment] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [editingEmployee, setEditingEmployee] = useState(null)
    const [viewingEmployee, setViewingEmployee] = useState(null)
    const [isAddingEmployee, setIsAddingEmployee] = useState(false)
    const [newEmployee, setNewEmployee] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        department: '',
        salary: '',
        joiningDate: '',
        isActive: true
    })
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('')
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [successMessage])

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem('token')

                const response = await fetch(
                    'https://localhost:7079/api/Employee',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch employees: ${response.status}`
                    )
                }

                const data = await response.json()
                setEmployees(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchEmployees()
    }, [])

    const handleEdit = (employee) => {
        setEditingEmployee(employee)
    }
    const handleSave = async () => {
        try {
            setError('')

            const token = localStorage.getItem('token')

            const response = await fetch(
                `https://localhost:7079/api/Employee/${editingEmployee.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        firstName: editingEmployee.firstName,
                        lastName: editingEmployee.lastName,
                        email: editingEmployee.email,
                        department: editingEmployee.department
                    })
                }
            )

            if (!response.ok) {
                throw new Error(`Update failed: ${response.status}`)
            }

            // Backend returns text, not JSON
            await response.text()

            setEditingEmployee(null)

            // Refresh employee list
            const updatedResponse = await fetch(
                'https://localhost:7079/api/Employee',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const updatedData = await updatedResponse.json()
            setEmployees(updatedData)

        } catch (err) {
            setError(err.message)
        }
    }
    const handleDelete = async (id) => {
        try {
            setError('')

            const token = localStorage.getItem('token')

            const response = await fetch(
                `https://localhost:7079/api/Employee/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`Delete failed: ${response.status}`)
            }

            await response.text()

            setEmployees((currentEmployees) =>
                currentEmployees.filter((employee) => employee.id !== id)
            )

        } catch (err) {
            setError(err.message)
        }
    }
    const validateEmployee = () => {
        if (!newEmployee.firstName.trim()) {
            return 'First Name is required'
        }

        if (!newEmployee.lastName.trim()) {
            return 'Last Name is required'
        }

        if (!newEmployee.email.trim()) {
            return 'Email is required'
        }

        if (!newEmployee.email.includes('@')) {
            return 'Please enter a valid email'
        }

        if (!newEmployee.phoneNumber.trim()) {
            return 'Phone Number is required'
        }

        if (!newEmployee.department.trim()) {
            return 'Department is required'
        }

        if (!newEmployee.salary) {
            return 'Salary is required'
        }

        if (Number(newEmployee.salary) < 0) {
            return 'Salary cannot be negative'
        }

        if (!newEmployee.joiningDate) {
            return 'Joining Date is required'
        }

        return ''
    }
    const handleAddEmployee = async () => {
        try {
            const validationError = validateEmployee()

            if (validationError) {
                setError(validationError)
                return
            }
            setError('')

            const token = localStorage.getItem('token')

            const response = await fetch(
                'https://localhost:7079/api/Employee',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        firstName: newEmployee.firstName,
                        lastName: newEmployee.lastName,
                        email: newEmployee.email,
                        phoneNumber: newEmployee.phoneNumber,
                        department: newEmployee.department,
                        salary: Number(newEmployee.salary),
                        joiningDate: newEmployee.joiningDate,
                        isActive: newEmployee.isActive
                    })
                }
            )

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(errorData || `Add employee failed: ${response.status}`)
            }

            const data = await response.json()

            setEmployees((currentEmployees) => [
                ...currentEmployees,
                data
            ])
            setSuccessMessage('Employee added successfully!')

            setNewEmployee({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                department: '',
                salary: '',
                joiningDate: '',
                isActive: true
            })

            setIsAddingEmployee(false)

        } catch (err) {
            setError(err.message)
        }
    }
  
    const handleSearch = async () => {
        if (!department.trim()) {
            setError('')
            return
        }

        try {
            setLoading(true)
            setError('')

            const token = localStorage.getItem('token')

            const response = await fetch(
                `https://localhost:7079/api/Employee/search?department=${encodeURIComponent(department)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error(
                    `Search failed: ${response.status}`
                )
            }

            const data = await response.json()
            setEmployees(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleShowAll = async () => {
        try {
            setLoading(true)
            setError('')
            setDepartment('')

            const token = localStorage.getItem('token')

            const response = await fetch(
                'https://localhost:7079/api/Employee',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch employees: ${response.status}`
                )
            }

            const data = await response.json()
            setEmployees(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="employee-dashboard">

            <div className="dashboard-header">
                <h1>Employee Dashboard</h1>

                <button
                    className="logout-button"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>

            {viewingEmployee && (
                <div className="view-employee-card">
                    <h2>Employee Details</h2>

                    <p><strong>ID:</strong> {viewingEmployee.id}</p>
                    <p><strong>First Name:</strong> {viewingEmployee.firstName}</p>
                    <p><strong>Last Name:</strong> {viewingEmployee.lastName}</p>
                    <p><strong>Email:</strong> {viewingEmployee.email}</p>
                    <p><strong>Phone:</strong> {viewingEmployee.phoneNumber}</p>
                    <p><strong>Department:</strong> {viewingEmployee.department}</p>
                    <p><strong>Salary:</strong> {viewingEmployee.salary}</p>
                    <p>
                        <strong>Status:</strong>{' '}
                        {viewingEmployee.isActive ? 'Active' : 'Inactive'}
                    </p>

                    <button onClick={() => setViewingEmployee(null)}>
                        Close
                    </button>
                </div>
            )}
            {editingEmployee && (
                <div className="edit-form">
                    <h2>Edit Employee</h2>

                    <input
                        type="text"
                        placeholder="First Name"
                        value={editingEmployee.firstName}
                        onChange={(e) =>
                            setEditingEmployee({
                                ...editingEmployee,
                                firstName: e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Last Name"
                        value={editingEmployee.lastName}
                        onChange={(e) =>
                            setEditingEmployee({
                                ...editingEmployee,
                                lastName: e.target.value
                            })
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={editingEmployee.email}
                        onChange={(e) =>
                            setEditingEmployee({
                                ...editingEmployee,
                                email: e.target.value
                            })
                        }
                    />

                    <button onClick={handleSave}>
                        Save
                    </button>

                    <button onClick={() => setEditingEmployee(null)}>
                        Cancel
                    </button>
                </div>
            )}
             
            <div className="employee-section">
                {successMessage && (
                    <p className="success-message">
                        {successMessage}
                    </p>
                )}

                <div className="employee-header">
                    <h2>Employees</h2>

                    <button
                        className="add-employee-button"
                        onClick={() => setIsAddingEmployee(true)}
                    >
                        + Add New Employee
                    </button>
                </div>
                {isAddingEmployee && (
                    <div className="add-form">

                        <h2>Add Employee</h2>

                        <div className="add-form-grid">

                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter first name"
                                    value={newEmployee.firstName}
                                    onChange={(e) =>
                                        setNewEmployee({
                                            ...newEmployee,
                                            firstName: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter last name"
                                    value={newEmployee.lastName}
                                    onChange={(e) =>
                                        setNewEmployee({
                                            ...newEmployee,
                                            lastName: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={newEmployee.email}
                                    onChange={(e) =>
                                        setNewEmployee({
                                            ...newEmployee,
                                            email: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter phone number"
                                    value={newEmployee.phoneNumber}
                                    onChange={(e) =>
                                        setNewEmployee({
                                            ...newEmployee,
                                            phoneNumber: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    placeholder="Enter department"
                                    value={newEmployee.department}
                                    onChange={(e) =>
                                        setNewEmployee({
                                            ...newEmployee,
                                            department: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Salary</label>
                                <input
                                    type="number"
                                    placeholder="Enter salary"
                                    value={newEmployee.salary}
                                    onChange={(e) =>
                                        setNewEmployee({
                                            ...newEmployee,
                                            salary: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Joining Date</label>
                                <input
                                    type="date"
                                    value={newEmployee.joiningDate}
                                    onChange={(e) =>
                                        setNewEmployee({
                                            ...newEmployee,
                                            joiningDate: e.target.value
                                        })
                                    }
                                />
                            </div>

                        </div>

                        <div className="add-form-actions">
                            <button onClick={handleAddEmployee}>
                                Save Employee
                            </button>

                            <button onClick={() => setIsAddingEmployee(false)}>
                                Cancel
                            </button>
                        </div>

                    </div>
                )}

                {!isAddingEmployee && (
                    <div>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Enter department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            />

                            <button onClick={handleSearch}>
                                Search
                            </button>

                            <button onClick={handleShowAll}>
                                Show All
                            </button>
                        </div>

                        {loading && <p>Loading employees...</p>}

                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}

                        {!loading && !error && (
                            employees.length === 0 ? (
                                <p>No employees found.</p>
                            ) : (
                                <table className="employee-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Department</th>
                                            <th>Salary</th>
                                            <th>Active</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {employees.map((employee, index) => (
                                            <tr key={employee.id}>
                                                <td>{index + 1}</td>
                                                <td>{employee.firstName}</td>
                                                <td>{employee.lastName}</td>
                                                <td>{employee.email}</td>
                                                <td>{employee.phoneNumber}</td>
                                                <td>{employee.department}</td>
                                                <td>{employee.salary}</td>

                                                <td>
                                                    {employee.isActive
                                                        ? 'Yes'
                                                        : 'No'}
                                                </td>

                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            setViewingEmployee(
                                                                employee
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                employee
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                employee.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default EmployeeDashboard

