import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LessonsPage.css";

const LessonsPage = () => {
    const { id } = useParams(); // ID jezika
    const [lessons, setLessons] = useState([]);
    const [newLesson, setNewLesson] = useState({ naziv: "", tekst: ""});
    const [editingLesson, setEditingLesson] = useState(null); // Stanje za izmenu lekcije
    const [updatedLesson, setUpdatedLesson] = useState({ naziv: "", tekst: ""});

    useEffect(() => {
        const fetchLessons = async () => {
            const response = await fetch(`http://localhost:8000/api/lessons?language_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLessons(data.data || []); // Koristimo data.data za paginaciju
            } else {
                console.error("Failed to fetch lessons.");
            }
        };

        fetchLessons();
    }, [id]);

    const handleAddLesson = async (event) => {
        event.preventDefault();
    
        const response = await fetch("http://localhost:8000/api/lessons", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ ...newLesson, language_id: id }), 
        });
    
        if (response.ok) {
            const data = await response.json();
            setLessons((prev) => [...prev, data.lesson]);
            setNewLesson({ naziv: "", tekst: "" }); // Reset polja
        } else {
            console.error("Error adding lesson:", await response.json());
        }
    };

    const handleEditLesson = async (event) => {
        event.preventDefault();
    
        const response = await fetch(`http://localhost:8000/api/lessons/${editingLesson.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedLesson), 
        });
    
        if (response.ok) {
            const data = await response.json();
            setLessons((prev) =>
                prev.map((lesson) =>
                    lesson.id === editingLesson.id ? data.lesson : lesson
                )
            );
            setEditingLesson(null);
            setUpdatedLesson({ naziv: "", tekst: "" }); // Reset polja
        } else {
            console.error("Error updating lesson:", await response.json());
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        const response = await fetch(`http://localhost:8000/api/lessons/${lessonId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.ok) {
            setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
        } else {
            console.error("Error deleting lesson:", await response.json());
        }
    };

    return (
        <div className="lessons-container">
            <h1 className="lessons-title">Lekcije</h1>
            {lessons.length > 0 ? (
                <ul className="lessons-list">
                    {lessons.map((lesson) => (
                        <li key={lesson.id} className="lesson-card">
                            <h2>{lesson.naziv}</h2>
                            <p>{lesson.tekst || "Bez opisa"}</p>
                            <div className="button-group">
                                <button
                                    className="edit-button"
                                    onClick={() => {
                                        setEditingLesson(lesson);
                                        setUpdatedLesson({
                                            naziv: lesson.naziv,
                                            tekst: lesson.tekst,
                                            language_id: lesson.language_id,
                                        });
                                    }}
                                >
                                    Izmeni
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                >
                                    Obriši
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-lessons">Trenutno nema lekcija za ovaj jezik.</p>
            )}
    
            <div className="form-container">
                {editingLesson ? (
                    <form className="edit-lesson-form" onSubmit={handleEditLesson}>
                        <h2>Izmeni lekciju</h2>
                        <div className="form-group">
                            <label htmlFor="edit-naziv">Naziv lekcije</label>
                            <input
                                id="edit-naziv"
                                type="text"
                                placeholder="Naziv lekcije"
                                value={updatedLesson.naziv}
                                onChange={(e) =>
                                    setUpdatedLesson({ ...updatedLesson, naziv: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-tekst">Opis lekcije</label>
                            <textarea
                                id="edit-tekst"
                                placeholder="Opis lekcije"
                                value={updatedLesson.tekst}
                                onChange={(e) =>
                                    setUpdatedLesson({ ...updatedLesson, tekst: e.target.value })
                                }
                            ></textarea>
                        </div>
                        <button type="submit" className="add-button">
                            Sačuvaj
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setEditingLesson(null)}
                        >
                            Otkaži
                        </button>
                    </form>
                ) : (
                    <form className="add-lesson-form" onSubmit={handleAddLesson}>
                        <h2>Dodaj novu lekciju</h2>
                        <div className="form-group">
                            <label htmlFor="naziv">Naziv lekcije</label>
                            <input
                                id="naziv"
                                type="text"
                                placeholder="Naziv lekcije"
                                value={newLesson.naziv}
                                onChange={(e) =>
                                    setNewLesson({ ...newLesson, naziv: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tekst">Opis lekcije</label>
                            <textarea
                                id="tekst"
                                placeholder="Opis lekcije"
                                value={newLesson.tekst}
                                onChange={(e) =>
                                    setNewLesson({ ...newLesson, tekst: e.target.value })
                                }
                            ></textarea>
                        </div>
                        <button type="submit" className="add-button">
                            Dodaj lekciju
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LessonsPage;
