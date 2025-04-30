import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import "./StatisticsPage.css";

const StatisticsPage = () => {
    const [totalLanguages, setTotalLanguages] = useState(0);
    const [totalProfessors, setTotalProfessors] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [studentsPerLanguage, setStudentsPerLanguage] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/allLanguages", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then(res => res.json())
            .then(data => setTotalLanguages(data.length));

        fetch("http://127.0.0.1:8000/api/professors", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then(res => res.json())
            .then(data => setTotalProfessors(data.length));

        fetch("http://127.0.0.1:8000/api/students", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then(res => res.json())
            .then(data => setTotalStudents(data.length));

        fetch("http://127.0.0.1:8000/api/students-per-language", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then(res => res.json())
            .then(data => setStudentsPerLanguage(data));
    }, []);

    return (
        <div className="stats-container">
            <h2>Statistika</h2>
            <div className="stats-cards">
                <div className="stat-card">
                    <h3>Ukupno jezika</h3>
                    <p>{totalLanguages}</p>
                </div>
                <div className="stat-card">
                    <h3>Ukupno profesora</h3>
                    <p>{totalProfessors}</p>
                </div>
                <div className="stat-card">
                    <h3>Ukupno učenika</h3>
                    <p>{totalStudents}</p>
                </div>
            </div>

            <h3>Broj učenika po jeziku</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={studentsPerLanguage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="language" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="student_count" fill="#4285f4" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StatisticsPage;
