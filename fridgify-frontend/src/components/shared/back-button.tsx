import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlArrowLeftCircle } from "react-icons/sl";

interface Props {
  setToTruePage: React.Dispatch<React.SetStateAction<boolean>>;
  setToFalsePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const BackButton: React.FC<Props> = ({ setToTruePage, setToFalsePage }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    //navigate(-1); // -1 goes back to the previous page
    setToTruePage(true);
    setToFalsePage(false);
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
