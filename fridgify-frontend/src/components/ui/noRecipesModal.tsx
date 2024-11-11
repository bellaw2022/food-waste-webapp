import React from "react";
import "./NoRecipesModal.css";

interface NoRecipesModalProps {
  onClose: () => void;
}

const NoRecipesModal: React.FC<NoRecipesModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <p>No recipes found</p>
      </div>
    </div>
  );
};

export default NoRecipesModal;
