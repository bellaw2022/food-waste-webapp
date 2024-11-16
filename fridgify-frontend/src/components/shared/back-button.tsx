import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlArrowLeftCircle } from "react-icons/sl";

interface Props {
  setToTruePage: React.Dispatch<React.SetStateAction<boolean>>[];
  setToFalsePage: React.Dispatch<React.SetStateAction<boolean>>[];
  setToBasePage: React.Dispatch<React.SetStateAction<boolean>>;
  backToBase: boolean;
}

const BackButton: React.FC<Props> = ({
  setToTruePage,
  setToFalsePage,
  backToBase,
  setToBasePage,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    console.log("backtobase: ", backToBase);
    for (let i = 0; i < setToFalsePage.length; i++) {
      setToFalsePage[i](false);
    }
    if (backToBase) {
      for (let i = 0; i < setToTruePage.length; i++) {
        setToTruePage[i](false);
      }
      setToBasePage(true);
    } else {
      for (let i = 0; i < setToTruePage.length; i++) {
        setToTruePage[i](true);
      }
    }
    //navigate(-1); // -1 goes back to the previous page
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
