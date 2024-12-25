import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LessonsPage.css";

const LessonsPage = () => {
    const { id } = useParams();
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        const fetchLessons = async () => {
            const response = await fetch(`http://localhost:8000/api/lessons?language_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLessons(data || []); // Osigurajte da je lessons uvek niz
            } else {
                setLessons([]); // U slučaju greške, postavite lessons na prazan niz
                console.error("Failed to fetch lessons.");
            }
        };

        fetchLessons();
    }, [id]);

    return (
        <div className="lessons-container">
            <h1 className="lessons-title">Lekcije</h1>
            {lessons.length > 0 ? (
                <ul className="lessons-list">
                    {lessons.map((lesson) => (
                        <li key={lesson.id} className="lesson-card">
                            <h2>{lesson.naziv}</h2>
                            <p>{lesson.tekst || "Bez opisa"}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-lessons">Trenutno nema lekcija za ovaj jezik.</p>
            )}
        </div>
    );
};

export default LessonsPage;
