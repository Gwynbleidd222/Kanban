import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);

  const openEditBoardModal = (board) => {
    setEditingBoard(board);
    setIsEditBoardModalOpen(true);
  };

  const closeEditBoardModal = () => {
    setEditingBoard(null);
    setIsEditBoardModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isEditBoardModalOpen, editingBoard, openEditBoardModal, closeEditBoardModal, setIsEditBoardModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);