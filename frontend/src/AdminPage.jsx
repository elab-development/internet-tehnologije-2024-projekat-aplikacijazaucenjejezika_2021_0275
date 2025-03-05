import { useEffect, useState } from "react";
import "./AdminPage.css";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/users", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then(res => {
            console.log("Response status:", res.status);
            return res.json();
        })
        .then(data => setUsers(data))
        .catch(error => console.error("Error fetching users:", error));
    }, []);
    const handleRoleChange = (userId, newRole) => {
        fetch(`http://127.0.0.1:8000/api/users/${userId}/role`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ role: newRole }),
        })
            .then((res) => res.json())
            .then((updatedUser) => {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === updatedUser.user.id ? updatedUser.user : user
                    )
                );
            });
    };

    return (
        <div>
            <div className="admin-container">
            <h2 className="admin-title">Admin Page</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <div className="role-options">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name={`role-${user.id}`}
                                            checked={user.role === "user"}
                                            onChange={() => handleRoleChange(user.id, "user")}
                                        />
                                        <span className="custom-radio"></span>
                                        User
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name={`role-${user.id}`}
                                            checked={user.role === "admin"}
                                            onChange={() => handleRoleChange(user.id, "admin")}
                                        />
                                        <span className="custom-radio"></span>
                                        Admin
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name={`role-${user.id}`}
                                            checked={user.role === "profesor"}
                                            onChange={() => handleRoleChange(user.id, "profesor")}
                                        />
                                        <span className="custom-radio"></span>
                                        Profesor
                                    </label>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
            
        </div>
    );
};

export default AdminPage;
