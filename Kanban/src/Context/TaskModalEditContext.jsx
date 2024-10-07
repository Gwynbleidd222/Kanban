import React, {createContext, useContext, useState} from "react";

const EditTaskModalContext = createContext ()

export const EditTaskModalProvider =({children}) => {
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)

    const openEditTaskModal = (task) => {
        setEditingTask(task)
        setIsEditTaskModalOpen(true)
    }

    const closeEditTaskModal = () => {
        setEditingTask(null)
        setIsEditTaskModalOpen(false)
    }

    return (
        <EditTaskModalContext.Provider value={{
            isEditTaskModalOpen, editingTask, openEditTaskModal, closeEditTaskModal, setIsEditTaskModalOpen
        }}>
            {children}
        </EditTaskModalContext.Provider>
    )
}

export const useEditTaskModal = () => useContext(EditTaskModalContext)