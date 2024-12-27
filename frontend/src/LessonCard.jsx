import React from "react";
import "./LessonCard.css";
import LessonCard from "./LessonCard";


const LessonCard = ({
  lesson,
  onEdit,
  onUpload,
  isUploading,
  onFileChange,
}) => {
    return (
        <LessonCard
          lesson={lesson}
          onEdit={handleEdit}
          onUpload={handleFileUpload}
          isUploading={isUploading}
          onFileChange={(e) => console.log("File selected:", e.target.files[0])}
        />
      );
};

export default LessonCard;