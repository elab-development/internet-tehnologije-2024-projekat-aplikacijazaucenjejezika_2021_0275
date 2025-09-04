import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageCard from "./LanguageCard";
import "./LanguagesPage.css";
import Select from "react-select";


const LanguagesPage = () => {
    const [languages, setLanguages] = useState([]);
    const [newLanguage, setNewLanguage] = useState({ naziv: "", skraceni_naziv: "" });
    const [editingLanguage, setEditingLanguage] = useState(null); // Stanje za izmenu jezika
    const [updatedLanguage, setUpdatedLanguage] = useState({ naziv: "", skraceni_naziv: "" });
    const navigate = useNavigate();
    const userRole = localStorage.getItem("role");

    const [students, setStudents] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchLanguages = async () => {
            const response = await fetch("http://localhost:8000/api/languages", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLanguages(data);
            }
        };

        fetchLanguages();
        if(userRole == 'profesor'){
            fetchStudents();
        }
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/students", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
            } else {
                console.error("Greška pri dobavljanju učenika:", await response.json());
            }
        } catch (error) {
            console.error("Greška pri povezivanju sa serverom:", error);
        }
    };

    const openEnrollModal = (language) => {
        setSelectedLanguage(language);
        setSelectedStudent(null);
    };

    const closeEnrollModal = () => {
        setSelectedLanguage(null);
    };

    const handleEnrollStudent = async () => {
        if (!selectedStudent) return;

        try {
            const response = await fetch("http://localhost:8000/api/lessons/enroll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    user_id: selectedStudent.value,
                    language_id: selectedLanguage.id,
                }),
            });

            if (response.ok) {
                console.log("Učenik uspešno upisan!");
                closeEnrollModal();
            } else {
                console.error("Greška pri upisu učenika:", await response.json());
            }
        } catch (error) {
            console.error("Greška pri slanju zahteva:", error);
        }
    };

    const handleAddLanguage = async (event) => {
        event.preventDefault();

        const response = await fetch("http://localhost:8000/api/languages/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(newLanguage),
        });
        if (response.ok) {
            const data = await response.json();
            setLanguages((prev) => [...prev, data.language]);
            setNewLanguage({ naziv: "", skraceni_naziv: "" });
        } else {
            console.error("Error adding language:", await response.json());
        }
    };

    const handleEditLanguage = async (event) => {
        event.preventDefault();
    
        const response = await fetch(`http://localhost:8000/api/languages/${editingLanguage.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedLanguage),
        });
    
        if (response.ok) {
            const data = await response.json();
            setLanguages((prev) =>
                prev.map((lang) => (lang.id === editingLanguage.id ? data.language : lang))
            );
            setEditingLanguage(null);
            setUpdatedLanguage({ naziv: "", skraceni_naziv: "" });
        } else {
            console.error("Error updating language:", await response.json());
        }
    };

    const handleDeleteLanguage = async (id) => {
        const response = await fetch(`http://localhost:8000/api/languages/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.ok) {
            setLanguages((prev) => prev.filter((lang) => lang.id !== id));
        } else {
            console.error("Error deleting language:", await response.json());
        }
    };

    return (
        <div className="languages-container">
        <h1 className="languages-title">Jezici</h1>
        <div className="languages-list">
          {languages.map((lang) => (
            <LanguageCard
              key={lang.id}
              lang={lang}
              onEdit={userRole === "profesor" ? (lang) => {
                            setEditingLanguage(lang);
                            setUpdatedLanguage({
                                naziv: lang.naziv,
                                skraceni_naziv: lang.skraceni_naziv,
                            });
                        } : null}
              onDelete={userRole === "profesor" ? handleDeleteLanguage : null}
              onNavigate={(id) => navigate(`/languages/${id}/lessons`)}
              userRole={userRole}
              onEnrollClick={userRole === "profesor" ? openEnrollModal : null}
            />
          ))}
        </div>

        {userRole === "profesor" && (
                editingLanguage ? (
                    <form className="add-language-form" onSubmit={handleEditLanguage}>
                        <h2>Izmeni jezik</h2>
                        <input
                            type="text"
                            placeholder="Naziv"
                            value={updatedLanguage.naziv}
                            onChange={(e) =>
                                setUpdatedLanguage({ ...updatedLanguage, naziv: e.target.value })
                            }
                            className="add-input"
                        />
                        <input
                            type="text"
                            placeholder="Skraćeni naziv"
                            value={updatedLanguage.skraceni_naziv}
                            onChange={(e) =>
                                setUpdatedLanguage({ ...updatedLanguage, skraceni_naziv: e.target.value })
                            }
                            className="add-input"
                        />
                        <button type="submit" className="add-button">
                            Sačuvaj
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingLanguage(null)}
                            className="add-button"
                            style={{ backgroundColor: "#dc3545" }}
                        >
                            Otkaži
                        </button>
                    </form>
                ) : (
                    <form className="add-language-form" onSubmit={handleAddLanguage}>
                        <input
                            type="text"
                            placeholder="Naziv"
                            value={newLanguage.naziv}
                            onChange={(e) =>
                                setNewLanguage({ ...newLanguage, naziv: e.target.value })
                            }
                            className="add-input"
                        />
                        <input
                            type="text"
                            placeholder="Skraćeni naziv"
                            value={newLanguage.skraceni_naziv}
                            onChange={(e) =>
                                setNewLanguage({ ...newLanguage, skraceni_naziv: e.target.value })
                            }
                            className="add-input"
                        />
                        <button type="submit" className="add-button">
                            Dodaj
                        </button>
                    </form>
                )
            )}

            {selectedLanguage && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Upis učenika u {selectedLanguage.naziv}</h3>
                        <Select
                            options={students.map((s) => ({ value: s.id, label: s.name + " (" + s.email+")" }))}
                            onChange={(selectedOption) => setSelectedStudent(selectedOption)}
                            placeholder="Pretraži učenike..."
                            isSearchable
                        />
                        <div className="modal-actions">
                            <button onClick={handleEnrollStudent} className="confirm-button" disabled={!selectedStudent}>
                                Potvrdi
                            </button>
                            <button onClick={closeEnrollModal} className="cancel-button">
                                Otkaži
                            </button>
                        </div>
                    </div>
                </div>
            )}
</div>

    );
};

export default LanguagesPage;
