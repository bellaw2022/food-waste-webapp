import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlArrowLeftCircle } from "react-icons/sl";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // -1 goes back to the previous page
  };

  return (
    <button onClick={handleBack} style={backButtonStyle}>
      <SlArrowLeftCircle size={24} />
    </button>
  );
};

const backButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  fontSize: "16px",
  padding: "16px 12px",
  backgroundColor: "#ffffff",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px",
};

export default BackButton;
