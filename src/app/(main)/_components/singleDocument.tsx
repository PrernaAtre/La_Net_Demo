import React from "react";
import { useSelector } from "react-redux";

const SingleDocument: React.FC = () => {
const singleDocument = useSelector((state) => state.notes.note);
  if (!singleDocument) {
    return <p>No note selected</p>;
  }

  return (
    <div>
      <h2>{singleDocument.title}</h2>
      <p>{singleDocument.description}</p>
      <img src={singleDocument.coverImageUrl} alt="Cover Image" />
      {/* Render other details of the note */}
    </div>
  );
};

export default SingleDocument;