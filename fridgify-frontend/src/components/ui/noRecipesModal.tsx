import React from "react";
import "./NoRecipesModal.css";
import { setBackend } from "@tensorflow/tfjs";

interface NoRecipesModalProps {
  onClose: () => void;
  setBasePage: React.Dispatch<React.SetStateAction<boolean>>;
  setListPage: React.Dispatch<React.SetStateAction<boolean>>;
  setRecipePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const NoRecipesModal: React.FC<NoRecipesModalProps> = ({
  onClose,
  setBasePage,
  setListPage,
  setRecipePage,
}) => {
  const handleClick = () => {
    onClose();
    setBasePage(true);
    setListPage(false);
    setRecipePage(false);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={handleClick}>
          ×
        </button>
        <p>No recipes found</p>
      </div>
    </div>
  );
};

export default NoRecipesModal;
