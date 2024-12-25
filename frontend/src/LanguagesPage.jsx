import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LanguagesPage.css";

const LanguagesPage = () => {
    const [languages, setLanguages] = useState([]);
    const [newLanguage, setNewLanguage] = useState({ naziv: "", skraceni_naziv: "" });
    const [editingLanguage, setEditingLanguage] = useState(null); // Stanje za izmenu jezika
    const [updatedLanguage, setUpdatedLanguage] = useState({ naziv: "", skraceni_naziv: "" });
    const navigate = useNavigate();

    useEffect(() => {
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
    }, []);

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
            <div
                key={lang.id}
                className="language-card"
                onClick={() => navigate(`/languages/${lang.id}/lessons`)}
                style={{ cursor: "pointer" }} // Dodajemo vizuelni pokazatelj da je kartica klikabilna
            >
                <div className="language-details">
                    <h2>{lang.naziv}</h2>
                    <p>{lang.skraceni_naziv}</p>
                </div>
                <div className="language-actions">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Sprečava da se onClick na kartici aktivira
                            setEditingLanguage(lang);
                            setUpdatedLanguage({
                                naziv: lang.naziv,
                                skraceni_naziv: lang.skraceni_naziv,
                            });
                        }}
                        className="languages-button edit-button"
                    >
                        Izmeni
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLanguage(lang.id);
                        }}
                        className="languages-button delete-button"
                    >
                        Obriši
                    </button>

                </div>
            </div>
        ))}
    </div>

    {editingLanguage ? (
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
                style={{ backgroundColor: "#dc3545" }} // Opcioni stil za dugme Otkaži
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
    )}
</div>

    );
};

export default LanguagesPage;
