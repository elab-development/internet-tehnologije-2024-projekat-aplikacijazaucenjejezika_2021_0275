import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LekcijaPage.css";

const LekcijaPage = () => {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [editing, setEditing] = useState(false);
    const [updatedLesson, setUpdatedLesson] = useState({ naziv: "", tekst: "" });
    const [isUploading, setIsUploading] = useState(false);
    const userRole = localStorage.getItem("role");

    const [isLessonCompleted, setIsLessonCompleted] = useState(
        localStorage.getItem(`lesson_completed_${lessonId}`) === "true"
    );

    useEffect(() => {
        const fetchLesson = async () => {
            const response = await fetch(`http://localhost:8000/api/lessons/${lessonId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLesson(data.data);
                setUpdatedLesson({
                    naziv: data.data.naziv,
                    tekst: data.data.tekst,
                    language_id: data.data.language.id, 
                });
            } else {
                console.error("Failed to fetch lesson.");
            }
        };
    
        fetchLesson();
    }, [lessonId]);

    const handleCheckboxChange = () => {
        const newValue = !isLessonCompleted;
        setIsLessonCompleted(newValue);
        localStorage.setItem(`lesson_completed_${lessonId}`, newValue.toString());
    };


    const handleSave = async (event) => {
        event.preventDefault();
    
        console.log("Updated Lesson (Before Save):", updatedLesson);
    
        const response = await fetch(`http://localhost:8000/api/lessons/${lessonId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedLesson),
        });
    
        if (response.ok) {
            const data = await response.json();
            setLesson(data.lesson);
            setEditing(false);
        } else {
            const errorData = await response.json();
            console.error("Error updating lesson:", errorData);
        }
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();
    
        setIsUploading(true); 
    
        const formData = new FormData();
        formData.append("file", event.target.file.files[0]);
    
        const response = await fetch(`http://localhost:8000/api/lessons/${lessonId}/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });
    
        if (response.ok) {
            const data = await response.json();
            // Ažurirajte listu fajlova na stranici
            setLesson((prevLesson) => ({
                ...prevLesson,
                files: [...(prevLesson.files || []), { name: event.target.file.files[0].name, path: data.path }],
            }));
        } else {
            console.error("Error uploading file");
        }
    
        setIsUploading(false); 
    };

    if (!lesson) return <p>Učitavanje...</p>;

    return (
        <div className="lesson-detail-container">
            {editing ? (
                <div className="edit-lesson-container">
                    <h2>Izmena lekcije</h2>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label htmlFor="naziv">Naziv lekcije:</label>
                            <input
                                id="naziv"
                                type="text"
                                value={updatedLesson.naziv}
                                onChange={(e) =>
                                    setUpdatedLesson({ ...updatedLesson, naziv: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tekst">Tekst lekcije:</label>
                            <textarea
                                id="tekst"
                                value={updatedLesson.tekst}
                                onChange={(e) =>
                                    setUpdatedLesson({ ...updatedLesson, tekst: e.target.value }) // Ovde koristimo `e.target.value`
                                }
                            ></textarea>
                        </div>
                        <button type="submit">Sačuvaj</button>
                        <button type="button" onClick={() => setEditing(false)}>
                            Otkaži
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <h1>{lesson.naziv}</h1>
                    <p>{lesson.tekst || "Bez opisa"}</p>
                    <p>Jezik: {lesson.language.naziv}</p>
                    {lesson.slike && lesson.slike.length > 0 && (
                        <div className="slike-container">
                            {lesson.slike.map((slika, index) => (
                                <img key={index} src={slika} alt={`Slika ${index + 1}`} />
                            ))}
                        </div>
                    )}

                    <div className="files-container">
                        <h2>Fajlovi</h2>
                        {lesson.files && lesson.files.length > 0 ? (
                            <ul>
                                {lesson.files.map((file, index) => (
                                    <li key={index}>
                                        {file.path.endsWith(".jpg") ||
                                        file.path.endsWith(".jpeg") ||
                                        file.path.endsWith(".png") ||
                                        file.path.endsWith(".gif") ? (
                                            <img src={`http://localhost:8000/storage/${file.path}`} alt={file.name} />
                                        ) : (
                                            <a href={`http://localhost:8000/storage/${file.path}`} target="_blank" rel="noopener noreferrer">
                                                {file.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Trenutno nema fajlova.</p>
                        )}
                    </div>

                    {userRole === "profesor" && (
                        <div> 
                            <button onClick={() => setEditing(true)}>Izmeni</button>
                    <div className="upload-container">
                        <h2>Dodaj fajl/sliku</h2>
                        <form onSubmit={handleFileUpload}>
                            <input type="file" name="file" id="file" />
                            <button type="submit" disabled={isUploading}>
                                {isUploading ? "Dodavanje..." : "Dodaj"}
                            </button>
                        </form>
                        {isUploading && <div className="spinner"></div>}
                    </div>
                        </div>
                    )}

                    {userRole === "user" && (
                        <div className="lesson-completion">
                            <label className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    checked={isLessonCompleted}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="slider"></span>
                                <span className="label-text">Pređena</span>
                            </label>
                        </div>
                    )}
                    
                </div>
            )}
        </div>
    );
};

export default LekcijaPage;
