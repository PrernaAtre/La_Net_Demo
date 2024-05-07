"use client";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { useState } from "react";

export const QuickNote = () => {
  const [textInput, setTextInput] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setTextInput(value);
    setButtonDisabled(value.trim() === "");
  };

  const handleButtonClick = () => {
    console.log("Button clicked");
  };

  return (
    <>
      <input
        type="text"
        placeholder="Write Something To Ask Ai....."
        className="p-1"
        value={textInput}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick} disabled={buttonDisabled}>
        Go.
      </button>
    </>
  );
};
