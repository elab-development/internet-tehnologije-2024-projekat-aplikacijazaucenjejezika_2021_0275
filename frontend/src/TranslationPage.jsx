import React, { useState } from "react";
import "./TranslationPage.css";

const TranslationPage = () => {
    const [text, setText] = useState("");
    const [source, setSource] = useState("en");
    const [target, setTarget] = useState("fr");
    const [translatedText, setTranslatedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [detectedLanguage, setDetectedLanguage] = useState(null);
    const [detecting, setDetecting] = useState(false);

    const detectLanguage = async (inputText) => {
        if (!inputText.trim()) {
            setDetectedLanguage(null);
            return;
        }

        setDetecting(true);
        try {
            const response = await fetch(
                `https://api.api-ninjas.com/v1/textlanguage?text=${encodeURIComponent(inputText)}`,
                {
                    headers: {
                        "X-Api-Key": "4h2986qFg1qz+Bvqvp+2sw==94wq33Syl8nF9NnS",
                    },
                }
            );
            const data = await response.json();
            setDetectedLanguage(data);
        } catch (err) {
            console.error("Greška pri detekciji jezika:", err);
            setDetectedLanguage(null);
        } finally {
            setDetecting(false);
        }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleDetectClick = () => {
        detectLanguage(text);
    };

    const handleTranslate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8000/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text, source, target }),
            });

            const data = await response.json();

            if (response.ok) {
                setTranslatedText(data.translated_text);
            } else {
                setError(data.error || "Greška pri prevođenju.");
            }
        } catch (err) {
            setError("Došlo je do greške. Pokušajte ponovo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="translation-container">
            <h1>Prevod reči</h1>
            <form className="translation-form" onSubmit={handleTranslate}>
                <textarea
                    placeholder="Unesite tekst za prevod..."
                    value={text}
                    onChange={handleTextChange}
                    required
                />
                <button type="button" onClick={handleDetectClick}>
                    Detektuj jezik
                </button>
                {detecting && <p>Detekcija jezika...</p>}
                {detectedLanguage && (
                    <p>
                        Detektovani jezik: <strong>{detectedLanguage.language}</strong> (
                        {detectedLanguage.iso})
                    </p>
                )}
                <div className="select-group">
                    <select value={source} onChange={(e) => setSource(e.target.value)}>
                        <option value="en">Engleski</option>
                        <option value="fr">Francuski</option>
                        <option value="es">Španski</option>
                        <option value="de">Nemački</option>
                    </select>
                    <select value={target} onChange={(e) => setTarget(e.target.value)}>
                        <option value="en">Engleski</option>
                        <option value="fr">Francuski</option>
                        <option value="es">Španski</option>
                        <option value="de">Nemački</option>
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Prevođenje..." : "Prevedi"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}
            {translatedText && (
                <div className="result">
                    <h2>Rezultat prevođenja:</h2>
                    <p>{translatedText}</p>
                </div>
            )}
        </div>
    );
};

export default TranslationPage;
