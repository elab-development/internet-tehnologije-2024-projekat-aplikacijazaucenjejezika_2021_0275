import React, { useState, useEffect } from "react";
import "./LanguageCard.css";

const LanguageCard = ({
  lang,
  onEdit,
  onDelete,
  onNavigate,
  userRole,
  onEnrollClick 
}) => {

  return (
    <div
      className="language-card"
      onClick={() => onNavigate(lang.id)}
      style={{ cursor: "pointer" }}
    >
      <div className="language-details">
        <h2>{lang.naziv}</h2>
        <p>{lang.skraceni_naziv}</p>
      </div>
      <div className="language-actions">
      {userRole === "profesor" && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(lang);
              }}
              className="languages-button edit-button"
            >
              Izmeni
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(lang.id);
              }}
              className="languages-button delete-button"
            >
              Obriši
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEnrollClick(lang);
              }}
              className="languages-button enroll-button"
            >
              Upiši učenika
            </button>
          </>
        )}
      </div>

    </div>
  );
};

export default LanguageCard;
