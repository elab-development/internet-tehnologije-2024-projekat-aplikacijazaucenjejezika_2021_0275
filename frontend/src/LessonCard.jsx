import React from "react";
import "./LessonCard.css";
import "./LessonsPage.css";

const LessonCard = ({
  lesson,
  onEdit,
  onDelete,
  onClick
}) => {

  const userRole = localStorage.getItem("role");
  const isLessonCompleted = localStorage.getItem(`lesson_completed_${lesson.id}`) === "true";

  return (
    <div 
      className={`lesson-card ${userRole === "user" && isLessonCompleted ? "completed-lesson" : ""}`} 
      onClick={() => onClick && onClick(lesson.id)}
    >
      <h2>{lesson.naziv}</h2>
      <p>{lesson.tekst || "Bez opisa"}</p>
      <div className="lesson-actions">
        {onEdit && (
          <button
            className="edit-button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(lesson);
            }}
          >
            Izmeni
          </button>
        )}
        {onDelete && (
          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(lesson.id);
            }}
          >
            Obriši
          </button>
        )}
      </div>
    </div>
  );
};


export default LessonCard;