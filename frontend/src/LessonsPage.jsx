import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LessonsPage.css";
import useLessons from "./useLessons";

const LessonsPage = () => {
    const { id } = useParams(); // ID jezika
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        naziv: "",
        language_id: id || "",
        predjena: "",
        page: 1,
        per_page: 10,
    });

    const { lessons, pagination, loading, error } = useLessons(filters);
    const [newLesson, setNewLesson] = useState({ naziv: "", tekst: "" });
    const [editingLesson, setEditingLesson] = useState(null);
    const [updatedLesson, setUpdatedLesson] = useState({ naziv: "", tekst: "" });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

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
            setFilters({ ...filters }); // Trigger reload
            setNewLesson({ naziv: "", tekst: "" });
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
            setFilters({ ...filters }); // Trigger reload
            setEditingLesson(null);
            setUpdatedLesson({ naziv: "", tekst: "" });
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
            setFilters({ ...filters }); // Trigger reload
        } else {
            console.error("Error deleting lesson:", await response.json());
        }
    };

    return (
        <div className="lessons-container">
            <h1 className="lessons-title">Lekcije</h1>

            <div className="filters">
                <input
                    type="text"
                    name="naziv"
                    placeholder="Pretraga po nazivu"
                    value={filters.naziv}
                    onChange={handleFilterChange}
                />
                <select
                    name="predjena"
                    value={filters.predjena}
                    onChange={handleFilterChange}
                >
                    <option value="">Svi</option>
                    <option value="true">Pređena</option>
                    <option value="false">Nije pređena</option>
                </select>
            </div>

            {loading && <p>Učitavanje...</p>}
            {error && <p>Greška: {error}</p>}
            {!loading && lessons.length > 0 && (
                <ul className="lessons-list">
                    {lessons.map((lesson) => (
                        <li
                            key={lesson.id}
                            className="lesson-card"
                            onClick={() => navigate(`/lekcija/${lesson.id}`)}
                        >
                            <h2>{lesson.naziv}</h2>
                            <p>{lesson.tekst || "Bez opisa"}</p>
                            <div className="button-group">
                                <button
                                    className="edit-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteLesson(lesson.id);
                                    }}
                                >
                                    Obriši
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {pagination && pagination.links && pagination.links.length > 0 && (
            <div className="pagination">
                {pagination.links.map((link, index) => (
                    <button
                        key={index}
                        disabled={!link.url} // Onemogućite dugmad bez URL-a
                        onClick={() => {
                            if (link.url) {
                                const urlParams = new URLSearchParams(link.url.split('?')[1]);
                                const newPage = urlParams.get('page');
                                handlePageChange(parseInt(newPage, 10));
                            }
                        }}
                        className={`pagination-button ${link.active ? "active" : ""}`}
                    >
                        {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
                    </button>
                ))}
            </div>
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
                                value={updatedLesson.tekst}
                                onChange={(e) =>
                                    setUpdatedLesson({ ...updatedLesson, tekst: e.target.value })
                                }
                            ></textarea>
                        </div>
                        <button type="submit">Sačuvaj</button>
                        <button
                            type="button"
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
                                value={newLesson.tekst}
                                onChange={(e) =>
                                    setNewLesson({ ...newLesson, tekst: e.target.value })
                                }
                            ></textarea>
                        </div>
                        <button type="submit">Dodaj lekciju</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LessonsPage;
